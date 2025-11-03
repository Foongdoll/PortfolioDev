import { useMemo, useState } from "react";
import CodeBlock from "../components/common/CodeBlock";

type ProjectSummary = {
  name: string;
  path: string;
  description: string;
  focus: string[];
};

type TechStack = {
  id: string;
  label: string;
  summary: string;
  description: string[];
  projects: ProjectSummary[];
  codeSamples?: Array<{ title: string; code: string; language: string }>;
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

const techStacks: TechStack[] = [
  {
    id: "typescript",
    label: "TypeScript",
    summary:
      "NestJS, React, and Electron working together for realtime collaboration, file delivery, and desktop polish.",
    description: [
      "Flowin Server keeps conversations, notes, and calendar events under one socket namespace without leaking state across rooms.",
      "WithU Backend normalizes every album asset regardless of origin and keeps partner access rules inside a single query builder.",
      "The desktop and web surfaces share transport code: Electron shell bridges reconnection, while StudyGround's axios layer shapes responses for TanStack Query.",
    ],
    projects: [
      {
        name: "Flowin Server (NestJS)",
        path: "public/sideprojects/flowinServer/flowin_server/src/chat",
        description: "Realtime collaboration API that serves chat, notes, and calendar features from one NestJS server.",
        focus: [
          "Namespace pins prevent cross-room events and the gateway pushes a ready signal so clients join explicitly.",
          "Rooms cap their in-memory history at 200 messages, making persistence sync predictable after deploys.",
        ],
      },
      {
        name: "WithU Backend (NestJS)",
        path: "public/sideprojects/withu/be/WithU-BE/src/album",
        description: "Partner album module that balances CDN delivery, local uploads, and partner visibility rules.",
        focus: [
          "`normalizeAlbumUrls` rebuilds every asset link server-side so the UI never mixes environment specific prefixes.",
          "Partner discovery happens once, letting the same query builder return personal and partner albums with pagination and search.",
        ],
      },
      {
        name: "WithU Front (Electron + React)",
        path: "public/sideprojects/withu/fe/WithU-FE/src",
        description: "Electron shell that reuses the web client and adds resilient socket reconnection hooks.",
        focus: [
          "JWT claims ride along with the reconnection handshake so missed messages can be replayed on resume.",
          "Socket events fan out via `CustomEvent`, keeping React components unaware of the Electron preload layer.",
        ],
      },
      {
        name: "StudyGround Front (React)",
        path: "public/sideprojects/studyground/fe/StudyGround/src/api/Axios.tsx",
        description: "Learning dashboard that centralizes network error handling and shapes all responses consistently.",
        focus: [
          "The axios interceptor routes every backend error through a global handler to surface instant toasts.",
          "Shared request helpers enforce a single result signature so caches stay type-safe across features.",
        ],
      },
    ],
    codeSamples: [
      {
        title: "Flowin Server - chat.gateway.ts",
        language: "typescript",
        code: typeScriptChatGatewaySample,
      },
      {
        title: "WithU Backend - album.service.ts",
        language: "typescript",
        code: typeScriptAlbumServiceSample,
      },
      {
        title: "WithU Front - Socket.ts",
        language: "typescript",
        code: typeScriptSocketClientSample,
      },
      {
        title: "StudyGround Front - Axios.tsx",
        language: "typescript",
        code: typeScriptAxiosSample,
      },
    ],
  },
  {
    id: "java",
    label: "Java (Spring Boot)",
    summary:
      "Spring Boot services where AI safety checks, vector search, and JWT secured study tools were hardened for production use.",
    description: [
      "AI Validator exposes audit friendly filters so support teams can slice message logs without shipping new queries.",
      "The shared AI utility keeps a lightweight QA cache in Qdrant and records few-shot examples for consistent scoring.",
      "AIKIT provisions Qdrant collections on demand and reindexes prompts in batches to keep experiments repeatable.",
      "StudyGround Backend wraps JWT verification into the security chain so learning tools stay locked while chat remains open.",
    ],
    projects: [
      {
        name: "AI Validator",
        path: "public/sideprojects/aivalidator/AI_VALIDATOR",
        description: "Spring Boot service that evaluates chat safety and stores the full assessment trail.",
        focus: [
          "The controller composes JPA Specifications for session, suitability, time range, and fuzzy search without N+1 surprises.",
          "`AIUtil` writes both QA cache entries and few-shot training examples into Qdrant with score based invalidation.",
        ],
      },
      {
        name: "AIKIT",
        path: "public/sideprojects/aikit/AIkit",
        description: "RAG playground that lets policy prompts evolve while keeping vector stores tidy.",
        focus: [
          "`QdrantService` estimates embedding dimensions and creates collections automatically before indexing data.",
          "Batch upserts and context clamping keep token counts predictable across reruns.",
        ],
      },
      {
        name: "StudyGround Backend",
        path: "public/sideprojects/studyground/be/StudyGroundJava",
        description: "Learning goals, todos, and flashcards protected by JWT and stateless sessions.",
        focus: [
          "SecurityFilterChain inserts the JWT filter before username-password auth and separates public chat endpoints.",
          "BCrypt password encoding is shared through a bean so sign-up and login stay aligned.",
        ],
      },
    ],
    codeSamples: [
      {
        title: "AI Validator - ValidatorController.java",
        language: "java",
        code: javaValidatorControllerSample,
      },
      {
        title: "AI Validator - AIUtil.java",
        language: "java",
        code: javaAiUtilSample,
      },
      {
        title: "AIKIT - QdrantService.java",
        language: "java",
        code: javaQdrantServiceSample,
      },
      {
        title: "StudyGround Backend - SecurityConfig.java",
        language: "java",
        code: javaSecurityConfigSample,
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
            <p className="text-xs font-semibold uppercase tracking-[0.35em] text-sky-600">Tech Log</p>
            <h1 className="mt-4 text-4xl font-bold text-slate-900 sm:text-5xl">Stack Insights</h1>
            <p className="mt-4 max-w-3xl text-base text-slate-600">
              Selected highlights from the projects living under <code>public/sideprojects</code>. Pick a stack to see the problem space, lessons learned, and a few representative snippets.
            </p>
          </div>
          <div className="rounded-3xl border border-slate-200 bg-white/80 px-5 py-4 text-sm text-slate-600 shadow-sm">
            All snippets were pulled straight from the repositories and trimmed for clarity. Prism handles the syntax highlighting.
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
    <nav className="rounded-3xl border border-slate-200 bg-white/80 p-6 shadow-sm backdrop-blur" aria-label="Tech stack list">
      <h2 className="text-sm font-semibold uppercase tracking-wide text-slate-900">Tech Stack</h2>
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
        <span className="text-xs font-semibold uppercase tracking-[0.3em] text-sky-600">Detail</span>
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
          <h2 className="text-sm font-semibold uppercase tracking-[0.2em] text-slate-500">Project Notes</h2>
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
              </article>
            ))}
          </div>
        </section>
      )}

      {stack.codeSamples?.map(({ title, code, language }) => (
        <section key={title} className="mt-10 space-y-4">
          <h2 className="text-sm font-semibold uppercase tracking-[0.2em] text-slate-500">{title}</h2>
          <CodeBlock language={language} code={code} />
        </section>
      ))}
    </section>
  );
}
