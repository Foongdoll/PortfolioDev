import { useMemo, useState } from "react";
import CodeBlock from "../components/common/CodeBlock";

type ProjectSummary = {
  name: string;
  path: string;
  description: string;
  focus: string[];
  codeSamples?: Array<{ title: string; code: string; language: string }>;
};

type TechStack = {
  id: string;
  label: string;
  summary: string;
  description: string[];
  projects: ProjectSummary[];
};

const typeScriptChatGatewaySample = `import {
  MessageBody,
  SubscribeMessage,
  WebSocketGateway,
  WebSocketServer,
  OnGatewayConnection,
  ConnectedSocket,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';

type ChatMsg =
  | { id: string; from: 'me' | 'friend'; type: 'text'; text: string; at: number }
  | { id: string; from: 'me' | 'friend'; type: 'image' | 'video'; uri: string; at: number };

@WebSocketGateway({ namespace: '/chat', cors: { origin: true, credentials: true } })
export class ChatGateway implements OnGatewayConnection {
  @WebSocketServer() server!: Server;

  private rooms: Map<string, ChatMsg[]> = new Map();

  handleConnection(client: Socket) {
    // clients call join before sending events
    client.emit('ready');
  }

  @SubscribeMessage('join')
  join(@ConnectedSocket() client: Socket, @MessageBody() room: string) {
    client.join(room);
    const history = this.rooms.get(room) ?? [];
    client.emit('history', history);
    return { ok: true };
  }

  @SubscribeMessage('message')
  message(
    @ConnectedSocket() client: Socket,
    @MessageBody() data: { room: string; msg: Omit<ChatMsg, 'id' | 'at'> },
  ) {
    const full: ChatMsg = {
      id: \`\${Date.now()}-\${Math.random().toString(16).slice(2)}\`,
      at: Date.now(),
      ...(data.msg as ChatMsg),
    };
    const list = this.rooms.get(data.room) ?? [];
    list.push(full);
    this.rooms.set(data.room, list.slice(-200));
    this.server.to(data.room).emit('message', full);
    return { ok: true };
  }
}
`;

const typeScriptAlbumServiceSample = `import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Album } from './entity/album.entity';
import { Photo } from './entity/photo.entity';
import { PartnerRequest, PartnerRequestStatus } from '../auth/entity/partner.entity';
import { AlbumQueryDto } from './dto/album.dto';
import { ResponseDto } from '../common/dto/response.dto';

@Injectable()
export class AlbumService {
  constructor(
    @InjectRepository(Album) private albumRepository: Repository<Album>,
    @InjectRepository(Photo) private photoRepository: Repository<Photo>,
    @InjectRepository(PartnerRequest) private partnerRequestRepository: Repository<PartnerRequest>,
  ) {}

  private normalizeUrl(url: string, baseUrl: string): string {
    if (!url) return url;
    if (url.startsWith('http://') || url.startsWith('https://')) return url;
    if (url.startsWith('/')) return \`\${baseUrl}\${url}\`;
    return \`\${baseUrl}/\${url}\`;
  }

  private normalizeAlbumUrls(album: Album, baseUrl: string): Album {
    return {
      ...album,
      coverPhotoUrl: this.normalizeUrl(album.coverPhotoUrl, baseUrl),
      photos: (album.photos ?? []).map((photo) => ({
        ...photo,
        url: this.normalizeUrl(photo.url, baseUrl),
      })),
    };
  }

  private async getPartnerUserId(userId: number): Promise<number | null> {
    const partnerRequest = await this.partnerRequestRepository.findOne({
      where: [
        { userCd: userId, status: PartnerRequestStatus.ACCEPTED },
        { partnerCd: userId, status: PartnerRequestStatus.ACCEPTED },
      ],
    });
    if (!partnerRequest) return null;
    return partnerRequest.userCd === userId ? partnerRequest.partnerCd : partnerRequest.userCd;
  }

  async findAll(userId: number, query: AlbumQueryDto, baseUrl: string) {
    const page = Number(query.page) || 1;
    const limit = Number(query.limit) || 12;
    const skip = (page - 1) * limit;
    const partnerUserId = await this.getPartnerUserId(userId);

    const queryBuilder = this.albumRepository
      .createQueryBuilder('album')
      .leftJoinAndSelect('album.photos', 'photos')
      .leftJoinAndSelect('album.user', 'user');

    if (partnerUserId) {
      queryBuilder.where('album.userId = :userId OR album.userId = :partnerUserId', { userId, partnerUserId });
    } else {
      queryBuilder.where('album.userId = :userId', { userId });
    }

    if (query.search) {
      queryBuilder.andWhere('album.title LIKE :search', { search: \`%\${query.search}%\` });
    }

    const [albums, total] = await queryBuilder
      .orderBy('album.createdAt', 'DESC')
      .skip(skip)
      .take(limit)
      .getManyAndCount();

    const albumsWithPreview = albums.map((album) => {
      const normalized = this.normalizeAlbumUrls(album, baseUrl);
      return {
        ...normalized,
        photoCount: normalized.photos.length,
        photos: normalized.photos.slice(0, 4),
      };
    });

    return ResponseDto.success(
      {
        albums: albumsWithPreview,
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit),
      },
      'Album list fetched successfully.',
      'success',
    );
  }
}
`;

const typeScriptSocketClientSample = `import { io, Socket } from 'socket.io-client';
import { isJwt, JWTPars } from './components/common/jwt/JwtUtil';

export const socket: Socket = io('http://13.124.87.223:3000', {
  reconnection: true,
  reconnectionAttempts: 10,
  reconnectionDelay: 1000,
  timeout: 20000,
});

let isFirstConnection = true;

socket.on('connect', () => {
  const jwt = isJwt();
  if (!jwt) return;

  try {
    const userData = JWTPars(jwt, ['userCd', 'userName']);
    socket.emit('userLogin', {
      userCd: userData.userCd,
      userName: userData.userName,
      isReconnection: !isFirstConnection,
    });

    const savedRoomCd = localStorage.getItem('currentRoomCd');
    if (savedRoomCd) {
      socket.emit('autoReconnectRoom', {
        roomCd: savedRoomCd,
        userCd: userData.userCd,
        isReconnection: !isFirstConnection,
      });

      if (window.location.pathname === '/message') {
        const lastSeen =
          localStorage.getItem('lastSeenTime') ??
          new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString();

        socket.emit('getMissedMessages', {
          roomCd: savedRoomCd,
          userCd: userData.userCd,
          lastSeen,
        });
      }
    }

    isFirstConnection = false;
  } catch (error) {
    console.error('Auto rejoin failed:', error);
  }
});

socket.on('missedMessages', ({ messages, roomCd }) => {
  window.dispatchEvent(
    new CustomEvent('receiveMissedMessages', {
      detail: { messages, roomCd },
    }),
  );
});
`;

const typeScriptAxiosSample = `import axios from 'axios';

const api = axios.create({
  baseURL: \`\${import.meta.env.VITE_API_SERVER}/api\`,
  withCredentials: false,
  headers: {
    'Content-Type': 'application/json',
  },
});

const apiMultipart = axios.create({
  baseURL: \`\${import.meta.env.VITE_API_SERVER}/api\`,
  withCredentials: false,
});

let setErrorGlobal: (err: { code: number; message?: string } | null) => void = () => {};

export const setAxiosErrorHandler = (setError: typeof setErrorGlobal) => {
  setErrorGlobal = setError;
};

api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response) {
      setErrorGlobal({
        code: error.response.data.code,
        message: error.response.data?.message,
      });
    }
    return Promise.reject(error);
  },
);

export const apiRequest = async <T>(config: any) => {
  const response = await api.request<{ data: T; status: number; message: string }>(config);
  return {
    data: response.data.data,
    status: response.data.status,
    message: response.data.message,
  };
};

export const apiMultipartRequest = async <T>(config: any) => {
  const response = await apiMultipart.request<{ data: T; status: number; message: string }>(config);
  return {
    data: response.data.data,
    status: response.data.status,
    message: response.data.message,
  };
};
`;

const javaValidatorControllerSample = `@GetMapping("/logs")
public Page<MessageLogItemDTO> list(
        @RequestParam Optional<String> sessionId,
        @RequestParam Optional<Suitability> suitability,
        @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE_TIME) Optional<Instant> from,
        @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE_TIME) Optional<Instant> to,
        @RequestParam Optional<String> q,
        @RequestParam(defaultValue = "0") int page,
        @RequestParam(defaultValue = "10") int size,
        @RequestParam(defaultValue = "createdAt,desc") String sort
) {
    Sort sortSpec = sort.contains(",")
            ? Sort.by(Sort.Direction.fromString(sort.split(",")[1]), sort.split(",")[0])
            : Sort.by(Sort.Direction.DESC, sort);

    Pageable pageable = PageRequest.of(page, size, sortSpec);

    Specification<MessageLog> spec = Specification.where(null);
    if (sessionId.isPresent() && !sessionId.get().isBlank()) spec = spec.and(sessionIdEq(sessionId.get()));
    if (suitability.isPresent()) spec = spec.and(suitabilityEq(suitability.get()));
    if (from.isPresent()) spec = spec.and(createdAtGte(from.get()));
    if (to.isPresent()) spec = spec.and(createdAtLte(to.get()));
    if (q.isPresent() && !q.get().isBlank()) spec = spec.and(qLike(q.get()));

    Page<MessageLog> pageResult = validatorService.logFindAll(spec, pageable);
    return pageResult.map(this::toItem);
}
`;

const javaAiUtilSample = `public void cacheSave(String question, String answer, String tenantId, String policyVersion) {
    var meta = Map.<String, Object>of(
            "type", "qa_cache",
            "answer", answer,
            "tenantId", tenantId,
            "policyVersion", policyVersion,
            "createdAt", java.time.Instant.now().toString()
    );
    var doc = Document.builder()
            .text(question)
            .metadata(meta)
            .build();
    qaCacheStore.add(List.of(doc));
}

public Optional<String> cacheLookup(String question, String tenantId, String policyVersion, double threshold) {
    var hits = qaCacheStore.similaritySearch(
            SearchRequest.builder()
                    .query(question)
                    .topK(3)
                    .filterExpression("type == 'qa_cache' && tenantId == '" + tenantId
                            + "' && policyVersion == '" + policyVersion + "'")
                    .build()
    );
    if (hits.isEmpty()) return Optional.empty();

    var top = hits.get(0);
    var score = top.getScore();
    if (score != null && score < threshold) return Optional.empty();

    return Optional.ofNullable(String.valueOf(top.getMetadata().get("answer")));
}

public void saveAssessmentExample(String userMessage, String label, String reason) {
    var meta = Map.<String, Object>of(
            "type", "assessment",
            "label", label,
            "reason", reason,
            "createdAt", java.time.Instant.now().toString()
    );
    var doc = Document.builder()
            .text(userMessage)
            .metadata(meta)
            .build();
    assessmentStore.add(List.of(doc));
}
`;

const javaQdrantServiceSample = `@Transactional
public void reindexPrompts() {
    ensureCollection();

    PromptEntity prompt = promptRepository.findByPromptType("RAG");
    List<PointStruct> batch = new ArrayList<>(UPSERT_BATCH);

    float[] vec = embeddingClient.embed(prompt.getPrompt());

    PointStruct point = PointStruct.newBuilder()
            .setId(id(prompt.getId()))
            .setVectors(vectors(vec))
            .putAllPayload(Map.of(
                    "promptId", value(String.valueOf(prompt.getId())),
                    "promptType", value(prompt.getPromptType()),
                    "text", value(prompt.getPrompt())
            ))
            .build();

    batch.add(point);
    if (!batch.isEmpty()) {
        upsertBatch(batch);
    }
}

private void ensureCollection() {
    try {
        boolean exists = qdrant.collectionExistsAsync(COLLECTION).get();
        if (!exists) {
            int dim = guessEmbeddingDim();
            qdrant.createCollectionAsync(
                    COLLECTION,
                    VectorParams.newBuilder()
                            .setDistance(Distance.Cosine)
                            .setSize(dim)
                            .build()
            ).get();
            Uninterruptibles.sleepUninterruptibly(300, TimeUnit.MILLISECONDS);
        }
    } catch (Exception e) {
        throw new RuntimeException("Qdrant collection check failed", e);
    }
}
`;

const javaSecurityConfigSample = `@Configuration
@EnableWebSecurity
@RequiredArgsConstructor
public class SecurityConfig {
    private final JwtAuthenticationFilter jwtAuthenticationFilter;
    private final CustomEntryPoint customEntryPoint;
    private final CustomUserDetailsService customUserDetailsService;

    @Bean
    public SecurityFilterChain securityFilterChain(HttpSecurity http) throws Exception {
        return http
                .csrf(csrf -> csrf.disable())
                .cors(Customizer.withDefaults())
                .sessionManagement(session -> session.sessionCreationPolicy(SessionCreationPolicy.STATELESS))
                .authorizeHttpRequests(auth -> auth
                        .requestMatchers("/api/auth/**", "/ws-chat/**", "/api/chat/**", "/topic/**", "/app/**").permitAll()
                        .requestMatchers("/api/goal/**", "/api/todo/**", "/api/note/**", "/api/flashcard/**").hasRole("USER")
                        .anyRequest().authenticated()
                )
                .exceptionHandling(exception -> exception.authenticationEntryPoint(customEntryPoint))
                .addFilterBefore(jwtAuthenticationFilter, UsernamePasswordAuthenticationFilter.class)
                .build();
    }

    @Bean
    public PasswordEncoder passwordEncoder() {
        return new BCryptPasswordEncoder();
    }

    @Bean
    public AuthenticationManager authenticationManager(AuthenticationConfiguration config) throws Exception {
        return config.getAuthenticationManager();
    }
}
`;

const dockerComposeAikitSample = `version: "3.9"

services:
  qdrant:
    image: qdrant/qdrant:latest
    container_name: qdrant
    restart: always
    ports:
      - "6333:6333"   # REST API / gRPC
      - "6334:6334"   # internal communication
    volumes:
      - ./qdrant_storage:/qdrant/storage
    environment:
      QDRANT__STORAGE__STORAGE_PATH: "/qdrant/storage"
      QDRANT__SERVICE__GRPC_PORT: 6334
      QDRANT__SERVICE__HTTP_PORT: 6333
`;

const dockerComposeAiValidatorSample = `version: "3.9"
services:
  qdrant:
    image: qdrant/qdrant:latest
    ports:
      - "6333:6333"   # REST API
      - "6334:6334"   # gRPC
    volumes:
      - ./qdrant_storage:/qdrant/storage
`;

const turboRepoConfigSample = `{
  "$schema": "https://turborepo.com/schema.json",
  "tasks": {
    "build": {
      "dependsOn": ["^build"],
      "inputs": ["$TURBO_DEFAULT$", ".env*"],
      "outputs": [".next/**", "!.next/cache/**"]
    },
    "lint": {
      "dependsOn": ["^lint"]
    },
    "check-types": {
      "dependsOn": ["^check-types"]
    },
    "dev": {
      "cache": false,
      "persistent": true
    }
  }
}
`;

const techStacks: TechStack[] = [
  {
    id: "typescript",
    label: "TypeScript",
    summary:
      "NestJS, React, Electron을 엮어 실시간 협업, 파일 전송, 데스크톱 경험을 안정화한 과정을 담았습니다.",
    description: [
      "Flowin Server는 단일 소켓 네임스페이스 안에서 채팅, 노트, 캘린더 이벤트를 룸 단위로 격리해 실시간 협업 품질을 유지합니다.",
      "WithU Backend는 업로드 출처가 달라도 앨범 자산을 서버에서 정규화하고, 파트너 권한을 하나의 쿼리 빌더에서 판별합니다.",
      "WithU 프런트와 Electron 셸은 동일한 전송 계층을 공유해 재연결 로직을 재사용하고, StudyGround의 Axios 래퍼는 TanStack Query 결과 객체를 표준화합니다.",
      "TanStack Query 캐시 키와 응답 어댑터를 통일해 API 스키마가 바뀌어도 타입 안정성과 캐시 무결성을 함께 지켰습니다.",
    ],
    projects: [
      {
        name: "Flowin Server (NestJS)",
        path: "public/sideprojects/flowinServer/flowin_server/src/chat",
        description: "NestJS 기반 실시간 협업 API로 채팅, 노트, 캘린더를 단일 게이트웨이에서 제공하며, 룸 격리로 이벤트 충돌을 막았습니다.",
        focus: [
          "네임스페이스와 룸을 명시적으로 분리하고 게이트웨이가 먼저 ready 신호를 발송해 클라이언트가 의도적으로 조인하도록 강제했습니다.",
          "메시지 히스토리를 룸당 200개로 제한해 메모리 사용량과 배포 후 동기화 시간을 예측 가능하게 유지했습니다.",
          "수신 메시지에는 서버에서 식별자와 타임스탬프를 부여해 재전송 순서를 보장하고, 클라이언트 재접속 시에도 정렬이 깨지지 않습니다.",
        ],
        codeSamples: [
          {
            title: "Flowin Server - chat.gateway.ts (소켓 게이트웨이)",
            language: "typescript",
            code: typeScriptChatGatewaySample,
          },
        ],
      },
      {
        name: "WithU Backend (NestJS)",
        path: "public/sideprojects/withu/be/WithU-BE/src/album",
        description: "파트너 전용 앨범 모듈로 CDN, 로컬 업로드, 접근 제어를 한 서비스 계층에서 조율합니다.",
        focus: [
          "`normalizeAlbumUrls` 함수로 환경별 CDN 경로를 서버에서 정규화해 프런트가 절대경로만 다루도록 했습니다.",
          "파트너 사용자 탐색을 1회 수행한 뒤 공통 쿼리 빌더에 주입해 개인/파트너 앨범을 같은 페이지네이션에서 다룹니다.",
          "검색, 정렬, 페이지네이션을 JPA 쿼리 빌더로 결합해 N+1 없이 상세 정보를 한 번에 로드합니다.",
        ],
        codeSamples: [
          {
            title: "WithU Backend - album.service.ts (앨범 서비스)",
            language: "typescript",
            code: typeScriptAlbumServiceSample,
          },
        ],
      },
      {
        name: "WithU Front (Electron + React)",
        path: "public/sideprojects/withu/fe/WithU-FE/src",
        description: "Electron 셸과 React 앱을 결합해 웹 클라이언트와 동일한 기능을 오프라인 친화적으로 제공합니다.",
        focus: [
          "JWT 클레임을 재연결 시점에도 함께 보내 누락된 메시지를 서버에서 필터링하고 보충합니다.",
          "소켓 이벤트를 `CustomEvent`로 브로드캐스트해 React 컴포넌트가 Electron preload 레이어와 직접 결합되지 않게 했습니다.",
          "자동 재연결과 지수 백오프 설정으로 일시적인 네트워크 단절에서도 세션이 끊기지 않습니다.",
        ],
        codeSamples: [
          {
            title: "WithU Front - Socket.ts (재연결 로직)",
            language: "typescript",
            code: typeScriptSocketClientSample,
          },
        ],
      },
      {
        name: "StudyGround Front (React)",
        path: "public/sideprojects/studyground/fe/StudyGround/src/api/Axios.tsx",
        description: "학습 대시보드의 네트워크 계층을 표준화해 오류 처리와 응답 가공을 일관되게 유지합니다.",
        focus: [
          "Axios 인터셉터에서 백엔드 오류를 전역 핸들러로 전달해 사용자에게 즉시 토스트로 안내합니다.",
          "공통 요청 헬퍼가 응답 형태를 통일해 TanStack Query 캐시가 타입 안전하게 동작합니다.",
          "`apiRequest`와 `apiMultipartRequest`를 분리해 파일 전송과 일반 요청 모두에서 재사용 가능한 래퍼를 제공했습니다.",
        ],
        codeSamples: [
          {
            title: "StudyGround Front - Axios.tsx (요청 래퍼)",
            language: "typescript",
            code: typeScriptAxiosSample,
          },
        ],
      },
    ],
  },
  {
    id: "java",
    label: "Java (Spring Boot)",
    summary:
      "AI 안전 점검, 벡터 검색, JWT 기반 학습 도구를 운영 환경에서 굳힌 Spring Boot 사례를 정리했습니다.",
    description: [
      "AI Validator는 세션, 적합도, 기간, 퍼지 검색을 조합한 필터를 제공해 새로운 쿼리를 배포하지 않고도 지원팀이 로그를 분석할 수 있습니다.",
      "공용 AI 유틸리티는 Qdrant에 QA 캐시와 few-shot 예시를 기록하고 점수 기반 무효화로 응답 품질을 일정하게 유지합니다.",
      "AIKIT은 Qdrant 컬렉션을 온디맨드로 생성하고 프롬프트를 배치 재인덱싱해 실험을 반복해도 상태를 깨끗하게 유지합니다.",
      "StudyGround Backend는 JWT 검증을 Spring Security 체인에 삽입해 학습 기능은 보호하면서 채팅과 인증 엔드포인트는 개방합니다.",
      "공통 유틸리티로 인증, 캐시, 벡터 연산 로직을 모듈화해 각 서비스가 중복 없이 기능을 공유합니다.",
    ],
    projects: [
      {
        name: "AI Validator",
        path: "public/sideprojects/aivalidator/AI_VALIDATOR",
        description: "챗봇 안전성을 평가하고 전체 판정 이력을 저장하는 Spring Boot 서비스입니다.",
        focus: [
          "컨트롤러는 세션, 적합도, 기간, 키워드 조건을 JPA Specification으로 조합해도 단일 쿼리로 조회합니다.",
          "`AIUtil`은 Qdrant에 QA 캐시와 평가 예시를 동시에 기록하고 점수 임계값으로 노이즈를 제거합니다.",
          "페이지 응답을 DTO로 변환해 프런트와 공유하고, 정렬 파라미터를 노출해 운영 중에도 분석 지표를 확장했습니다.",
        ],
        codeSamples: [
          {
            title: "AI Validator - ValidatorController.java (로그 조회)",
            language: "java",
            code: javaValidatorControllerSample,
          },
          {
            title: "AI Validator - AIUtil.java (Qdrant 캐시)",
            language: "java",
            code: javaAiUtilSample,
          },
        ],
      },
      {
        name: "AIKIT",
        path: "public/sideprojects/aikit/AIkit",
        description: "정책 프롬프트를 실험하고 벡터스토어 상태를 자동으로 유지하는 RAG 실험 도구입니다.",
        focus: [
          "`QdrantService`가 임베딩 차원을 추정해 컬렉션을 자동 생성하고 새 실험마다 재사용합니다.",
          "배치 업서트와 컨텍스트 클램핑으로 토큰 수를 예측 가능하게 유지해 비용을 통제합니다.",
          "재인덱싱 루틴을 @Transactional로 감싸 실패 시 롤백해 QA 캐시와 실험 데이터가 어긋나지 않게 했습니다.",
        ],
        codeSamples: [
          {
            title: "AIKIT - QdrantService.java (벡터스토어 관리)",
            language: "java",
            code: javaQdrantServiceSample,
          },
        ],
      },
      {
        name: "StudyGround Backend",
        path: "public/sideprojects/studyground/be/StudyGroundJava",
        description: "학습 목표, 할 일, 플래시카드를 JWT로 보호하는 Spring Boot 백엔드입니다.",
        focus: [
          "SecurityFilterChain에서 JWT 필터를 UsernamePasswordAuthenticationFilter보다 앞에 두어 토큰 검증을 우선 처리합니다.",
          "공개 채팅 엔드포인트와 보호된 학습 API를 분리해 권한 정책을 명확히 했습니다.",
          "BCrypt 비밀번호 인코더와 AuthenticationManager 빈을 분리해 테스트와 운영 환경의 인증 구성을 단순화했습니다.",
        ],
        codeSamples: [
          {
            title: "StudyGround Backend - SecurityConfig.java (보안 설정)",
            language: "java",
            code: javaSecurityConfigSample,
          },
        ],
      },
    ],
  },
  {
    id: "devops",
    label: "DevOps & 배포",
    summary:
      "Docker Compose와 Turborepo, CI 파이프라인으로 ML 백엔드와 다중 앱 모노레포를 안정적으로 배포한 경험을 모았습니다.",
    description: [
      "AIKIT과 AI Validator는 동일한 Qdrant 설정을 공유해 로컬, 스테이징, 프로덕션에서 같은 환경을 재현합니다.",
      "Turborepo 캐시 전략과 의존성 그래프로 빌드 시간을 줄이고, 타입 검사와 린트를 병렬 실행합니다.",
      "Compose 템플릿에 포트 매핑과 볼륨 정책을 명시해 데이터 손실 없이 롤백과 재시작이 가능합니다.",
      "CI 단계는 테스트, 타입 검사, 린트를 나눠 실패 지점을 명확히 드러내고 캐시를 활용해 반복 실행 비용을 줄입니다.",
    ],
    projects: [
      {
        name: "AIKIT Docker Compose",
        path: "public/sideprojects/aikit/AIkit/src/main/resources/static/docker-compose.yml",
        description: "RAG 실험에서 사용되는 Qdrant를 빠르게 띄우기 위한 Docker Compose 템플릿입니다.",
        focus: [
          "컨테이너 이름과 재시작 정책을 고정해 로컬 개발과 배포 스크립트에서 동일한 명령을 재사용합니다.",
          "HTTP와 gRPC 포트를 모두 노출해 백엔드와 벡터스토어 간 통신 경로를 명확히 했습니다.",
          "볼륨을 `/qdrant/storage`에 마운트해 임베딩 데이터를 안정적으로 보존합니다.",
        ],
        codeSamples: [
          {
            title: "AIKIT - docker-compose.yml (Qdrant)",
            language: "yaml",
            code: dockerComposeAikitSample,
          },
        ],
      },
      {
        name: "AI Validator Docker Compose",
        path: "public/sideprojects/aivalidator/AI_VALIDATOR/src/main/resources/static/docker-compose.yml",
        description: "안전성 평가 서비스에서도 동일한 Qdrant 구성을 재사용할 수 있도록 Compose를 통일했습니다.",
        focus: [
          "서비스 포트 6333/6334를 나눠 노출해 REST와 gRPC 트래픽을 각각 다룹니다.",
          "볼륨 경로를 프로젝트 루트와 맞춰 로그와 벡터 데이터를 쉽게 백업할 수 있습니다.",
          "간결한 설정으로 QA 팀이 로컬에서 즉시 벡터스토어를 구동할 수 있도록 문서화했습니다.",
        ],
        codeSamples: [
          {
            title: "AI Validator - docker-compose.yml (Qdrant)",
            language: "yaml",
            code: dockerComposeAiValidatorSample,
          },
        ],
      },
      {
        name: "DevOps Hub (Turborepo)",
        path: "public/sideprojects/devops-hub/Devops-hub/turbo.json",
        description: "다중 앱 모노레포의 빌드, 타입, 린트를 Turborepo에서 orchestration 합니다.",
        focus: [
          "의존 앱의 결과를 재사용하도록 `dependsOn`을 정의해 중복 작업을 줄입니다.",
          "환경 파일 변화만 캐시 무효화 조건에 추가해 빌드 캐시 효율을 극대화했습니다.",
          "개발 서버 작업은 영구 캐시를 비활성화해 핫 리로드 경험을 해치지 않습니다.",
        ],
        codeSamples: [
          {
            title: "DevOps Hub - turbo.json (빌드 파이프라인)",
            language: "json",
            code: turboRepoConfigSample,
          },
        ],
      },
    ],
  },
];

export default function TechLog() {
  const [activeStackId, setActiveStackId] = useState<string>(techStacks[0].id);
  const activeStack = useMemo(
    () => techStacks.find((stack) => stack.id === activeStackId) ?? techStacks[0],
    [activeStackId]
  );

  return (
    <div className="w-full min-h-screen bg-gradient-to-b from-sky-50 via-white to-indigo-50 text-slate-800">
      <header className="border-b border-slate-200 bg-white/80 backdrop-blur">
        <div className="mx-auto flex max-w-6xl flex-col gap-6 px-4 py-16 sm:px-6 lg:flex-row lg:items-end lg:justify-between lg:px-8">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.35em] text-sky-600">기술 로그</p>
            <h1 className="mt-4 text-4xl font-bold text-slate-900 sm:text-5xl">스택 인사이트</h1>
            <p className="mt-4 max-w-3xl text-base text-slate-600">
              스택을 고르면 문제 정의와 해결 과정, 그리고 대표 코드 조각을 바로 확인할 수 있습니다.
            </p>
          </div>
          <div className="rounded-3xl border border-slate-200 bg-white/80 px-5 py-4 text-sm text-slate-600 shadow-sm">
            모든 코드는 실제 저장소에서 가져와 필요한 부분만 정리했습니다. 문법 하이라이팅은 Prism이 담당하고 있어요.
          </div>
        </div>
      </header>

      <main className="mx-auto w-full max-w-6xl px-4 py-12 sm:px-6 lg:px-8">
        <div className="grid gap-8 lg:grid-cols-[280px,1fr] lg:gap-12">
          <TechList techStacks={techStacks} activeStackId={activeStackId} onSelect={setActiveStackId} />
          <TechContent stack={activeStack} />
        </div>
      </main>
    </div>
  );
}

type TechListProps = {
  techStacks: TechStack[];
  activeStackId: string;
  onSelect: (id: string) => void;
};

function TechList({ techStacks, activeStackId, onSelect }: TechListProps) {
  return (
    <nav className="rounded-3xl border border-slate-200 bg-white/80 p-6 shadow-sm backdrop-blur" aria-label="기술 스택 목록">
      <h2 className="text-sm font-semibold uppercase tracking-wide text-slate-900">기술 스택</h2>
      <ul className="mt-6 space-y-2">
        {techStacks.map((stack) => {
          const isActive = stack.id === activeStackId;
          const baseClasses =
            "w-full rounded-2xl border px-4 py-3 text-left text-sm font-semibold transition-all duration-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-offset-slate-50";
          const stateClasses = isActive
            ? "border-sky-300 bg-sky-50 text-sky-700 shadow-sm focus-visible:ring-sky-400"
            : "border-slate-200 bg-white/80 text-slate-600 hover:border-slate-300 hover:bg-white focus-visible:ring-slate-300";

          return (
            <li key={stack.id}>
              <button
                type="button"
                onClick={() => onSelect(stack.id)}
                className={`${baseClasses} ${stateClasses}`}
              >
                {stack.label}
              </button>
            </li>
          );
        })}
      </ul>
    </nav>
  );
}

type TechContentProps = {
  stack: TechStack;
};

function TechContent({ stack }: TechContentProps) {
  return (
    <section
      className="rounded-3xl border border-slate-200 bg-white/90 p-8 shadow-lg backdrop-blur"
      aria-labelledby={`${stack.id}-title`}
    >
      <header className="border-b border-slate-200 pb-8">
        <span className="text-xs font-semibold uppercase tracking-[0.3em] text-sky-600">상세</span>
        <h1 id={`${stack.id}-title`} className="mt-4 text-3xl font-bold text-slate-900">
          {stack.label}
        </h1>
        <p className="mt-4 text-base leading-relaxed text-slate-600">{stack.summary}</p>
      </header>

      <article className="mt-8 space-y-6 text-base leading-relaxed text-slate-700">
        {stack.description.map((paragraph, index) => (
          <p key={index}>{paragraph}</p>
        ))}
      </article>

      {stack.projects.length > 0 && (
        <section className="mt-10 space-y-5">
          <h2 className="text-sm font-semibold uppercase tracking-[0.2em] text-slate-500">프로젝트 노트</h2>
          <div className="grid gap-4">
            {stack.projects.map((project) => (
              <article
                key={project.name}
                className="rounded-2xl border border-slate-200 bg-white/90 p-5 shadow-sm transition hover:shadow-md"
              >
                <header className="flex flex-col gap-1">
                  <h3 className="text-lg font-semibold text-slate-900">{project.name}</h3>
                  <code className="text-xs text-sky-600">{project.path}</code>
                </header>
                <p className="mt-3 text-sm text-slate-600">{project.description}</p>
                <ul className="mt-4 list-disc space-y-2 pl-4 text-sm text-slate-700">
                  {project.focus.map((item) => (
                    <li key={item}>{item}</li>
                  ))}
                </ul>
                {project.codeSamples?.map(({ title, code, language }) => (
                  <div key={title} className="mt-6 space-y-3">
                    <h4 className="text-xs font-semibold uppercase tracking-[0.2em] text-slate-500">{title}</h4>
                    <CodeBlock language={language} code={code} />
                  </div>
                ))}
              </article>
            ))}
          </div>
        </section>
      )}
    </section>
  );
}
