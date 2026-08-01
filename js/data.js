/**
 * data.js
 * ---------------------------------------------------------------------------
 * ALL FAKE / PLACEHOLDER CONTENT LIVES HERE.
 * This is the ONLY file most people (or an AI coding agent) need to edit to
 * turn this into a real portfolio. Nothing here touches layout or animation —
 * see js/book.js and css/style.css for that.
 *
 * Every field is commented. Replace values in quotes. Arrays can have items
 * added or removed freely; the book paginates automatically.
 * ---------------------------------------------------------------------------
 */

const DATA = {

  // ---------------------------------------------------------------------
  // SITE / COVER
  // ---------------------------------------------------------------------
  site: {
    name: "Aarav Mehta",
    subtitle: "Life, Projects & Vision",
    tagline: "A working record of what I've built, what I'm learning, and where it's going",
    favicon: "📖"
  },

  // ---------------------------------------------------------------------
  // FOREWORD (first page after the cover)
  // ---------------------------------------------------------------------
  foreword: {
    quote: "Every system I've built started as a question I couldn't stop asking.",
    body: `This book is a running account of that questioning — a decade-in-progress
    of code, research, and small obsessions that turned into a career. It's organized
    like a life would be: where I started, what I've learned, what I've made, and
    where I think it's all heading. Turn the page whenever you're ready.`
  },

  // ---------------------------------------------------------------------
  // CHAPTER 1 — WHO AM I
  // ---------------------------------------------------------------------
  whoAmI: {
    intro: `I'm a software engineer and researcher based in Bengaluru, India, working at the
    intersection of distributed systems and applied machine learning. I studied Computer
    Science at BITS Pilani, and since then I've split my time between production
    engineering roles and independent research on efficient model inference.`,
    bio: `I grew up taking apart the family desktop more often than my parents would have
    liked, which eventually turned into a Computer Science degree and, later, a habit of
    reading operating-system source code for fun on weekends. I care about software that
    disappears into the background and does its job quietly — systems people trust without
    thinking about.`,
    vision: `I want to spend my career narrowing the gap between "research works in a notebook"
    and "research runs reliably at 3am without anyone paging me." A lot of the most
    interesting engineering happens in that gap.`,
    goals: [
      "Ship a production ML system that measurably improves someone's daily work",
      "Contribute meaningfully to an open-source compiler or runtime project",
      "Publish research on efficient on-device inference",
      "Mentor five engineers into their first systems role"
    ],
    philosophy: `Simple systems fail in simple ways. I'd rather ship something boring that
    I understand completely than something clever that only I can debug at 2am.`
  },

  // ---------------------------------------------------------------------
  // CHAPTER 2 — ABOUT ME
  // ---------------------------------------------------------------------
  about: {
    education: [
      {
        year: "2019 — 2023",
        title: "B.E. in Computer Science",
        place: "BITS Pilani, Hyderabad Campus",
        detail: "Thesis on quantization-aware training for edge-deployed speech models. Graduated with distinction."
      },
      {
        year: "2023",
        title: "Summer Research Fellow",
        place: "Indian Institute of Science (IISc), Dept. of CSA",
        detail: "Worked on low-latency scheduling for mixed CPU/GPU inference pipelines."
      },
      {
        year: "2017 — 2019",
        title: "Higher Secondary — Science",
        place: "Delhi Public School, R.K. Puram",
        detail: "Specialized in Physics, Chemistry, Mathematics, and Computer Science."
      }
    ],
    journey: `My path wasn't a straight line — I started out convinced I'd become a
    hardware engineer, spent a year deep in competitive programming, and only found
    machine learning in my third year of college through a course project that refused
    to work correctly for three straight weeks. That frustration turned into a fascination
    I never really recovered from.`,
    growth: `The biggest shift in how I work happened after my first production outage —
    a caching bug that took down a service for forty minutes. It taught me more about
    writing careful, defensive code than any course did. I've kept a personal postmortem
    log ever since, for my own mistakes as much as anyone else's.`,
    skillsSnapshot: [
      { label: "Systems & Backend", value: 90 },
      { label: "Machine Learning", value: 82 },
      { label: "Distributed Infra", value: 78 },
      { label: "Frontend / DX", value: 60 }
    ]
  },

  // ---------------------------------------------------------------------
  // CHAPTER 3 — PROJECTS
  // ---------------------------------------------------------------------
  projects: [
    {
      title: "Wayfarer",
      subtitle: "A distributed task scheduler for heterogeneous compute",
      description: `Wayfarer schedules mixed CPU/GPU inference jobs across a small
      cluster, prioritizing by deadline and cost rather than raw throughput. Built after
      getting tired of hand-tuning cron jobs for a research pipeline that kept growing.`,
      tech: ["Go", "gRPC", "Redis", "Kubernetes", "Prometheus"],
      github: "https://github.com/example/wayfarer",
      demo: "https://wayfarer.example.dev",
      learned: `Backpressure is a design decision, not an afterthought — retrofitting it
      into a scheduler that didn't have it from day one cost me two weeks I didn't budget for.`
    },
    {
      title: "Marginalia",
      subtitle: "Lightweight semantic search for personal note archives",
      description: `A local-first search tool that indexes markdown notes with sentence
      embeddings, so you can search by meaning instead of exact keywords — entirely
      offline, no data leaves the machine.`,
      tech: ["Python", "FastAPI", "SQLite", "sentence-transformers", "Svelte"],
      github: "https://github.com/example/marginalia",
      demo: "https://marginalia.example.dev",
      learned: `Embedding search feels magical in a demo and mediocre in daily use unless
      you also solve re-ranking. The unglamorous half of the problem is the half that matters.`
    },
    {
      title: "Kiln",
      subtitle: "A tiny compiler for a teaching-focused language",
      description: `Kiln is a small statically-typed language and compiler I built to
      actually understand how type inference and register allocation work, rather than
      just reading about them. It compiles to a simple bytecode VM written from scratch.`,
      tech: ["Rust", "LLVM (learning module)", "Custom VM"],
      github: "https://github.com/example/kiln-lang",
      demo: "",
      learned: `Writing a type checker made me a noticeably better reader of other
      people's type errors — I stopped treating the compiler as an oracle and started
      treating it as a conversation.`
    },
    {
      title: "Tideline",
      subtitle: "Real-time collaborative timeline editor",
      description: `A CRDT-backed timeline editor for research teams to jointly annotate
      experiment logs in real time, built as a weekend project that a lab down the hall
      ended up actually adopting.`,
      tech: ["TypeScript", "Yjs", "WebSockets", "Node.js"],
      github: "https://github.com/example/tideline",
      demo: "https://tideline.example.dev",
      learned: `CRDTs solve conflict resolution beautifully and solve almost nothing about
      good UX around presence and intent — that part still had to be designed by hand.`
    }
  ],

  // ---------------------------------------------------------------------
  // CHAPTER 4 — TECHNOLOGIES
  // ---------------------------------------------------------------------
  technologies: {
    "Programming Languages": ["Python", "Go", "TypeScript", "Rust", "C++", "SQL"],
    "Frontend": ["React", "Svelte", "Vanilla JS/CSS", "Tailwind CSS"],
    "Backend": ["FastAPI", "Node.js", "gRPC", "PostgreSQL", "Redis"],
    "AI / Machine Learning": ["PyTorch", "sentence-transformers", "ONNX Runtime", "scikit-learn"],
    "Cloud & DevOps": ["AWS (EC2, S3, Lambda)", "Docker", "Kubernetes", "Terraform", "GitHub Actions"],
    "Databases": ["PostgreSQL", "SQLite", "Redis", "ClickHouse"],
    "Operating Systems & Tools": ["Linux (daily driver)", "Git", "tmux", "Neovim", "Wireshark"]
  },

  // ---------------------------------------------------------------------
  // CHAPTER 5 — EXPERIENCE
  // ---------------------------------------------------------------------
  experience: [
    {
      type: "Internship",
      title: "Backend Engineering Intern",
      org: "Northstar Systems",
      period: "May 2023 — Aug 2023",
      detail: "Rebuilt the billing service's retry logic, cutting duplicate-charge incidents to zero over the following two quarters."
    },
    {
      type: "Hackathon",
      title: "1st Place — HackBLR 2022",
      org: "48-hour systems track",
      period: "Nov 2022",
      detail: "Built a real-time anomaly detector for IoT sensor streams with two teammates, judged on both performance and code quality."
    },
    {
      type: "Open Source",
      title: "Core Contributor",
      org: "openrouter-cache (community project)",
      period: "2023 — present",
      detail: "Maintain the caching layer; reviewed and merged 40+ community pull requests."
    },
    {
      type: "Research",
      title: "Research Assistant",
      org: "IISc, Dept. of Computer Science & Automation",
      period: "Jun 2023 — Sep 2023",
      detail: "Co-authored a workshop paper on latency-aware scheduling for mixed-precision inference workloads."
    },
    {
      type: "Leadership",
      title: "Lead Organizer",
      org: "Campus Systems Club",
      period: "2021 — 2023",
      detail: "Grew a 12-person club to 90+ members; ran a weekly reading group on distributed systems papers."
    }
  ],

  // ---------------------------------------------------------------------
  // CHAPTER 6 — CERTIFICATES
  // ---------------------------------------------------------------------
  certificates: [
    { title: "AWS Certified Solutions Architect — Associate", issuer: "Amazon Web Services", year: "2024", image: "assets/certificates/placeholder-1.svg" },
    { title: "Deep Learning Specialization", issuer: "DeepLearning.AI", year: "2022", image: "assets/certificates/placeholder-2.svg" },
    { title: "Kubernetes for Developers", issuer: "The Linux Foundation", year: "2023", image: "assets/certificates/placeholder-3.svg" }
  ],

  // ---------------------------------------------------------------------
  // CHAPTER 7 — RESEARCH
  // ---------------------------------------------------------------------
  research: {
    interests: [
      "Efficient on-device inference for speech models",
      "Latency-aware scheduling across heterogeneous hardware",
      "Compiler-level optimizations for small language models",
      "Human-in-the-loop evaluation for agentic systems"
    ],
    future: `Over the next few years I want to move from optimizing systems around models
    to co-designing them — treating the model architecture and the serving system as one
    problem instead of two. I'm currently reading widely on speculative decoding and
    hardware-aware quantization to build toward that.`,
    experiments: [
      "A tiny speculative-decoding demo for a 1B parameter model on consumer GPUs",
      "Benchmarking compiler-level fusion strategies for transformer inference",
      "A weekend prototype exploring voice-driven robotics control"
    ]
  },

  // ---------------------------------------------------------------------
  // CHAPTER 8 — PHOTOGRAPHY (optional gallery)
  // ---------------------------------------------------------------------
  photography: [
    { caption: "Western Ghats, monsoon 2023", image: "assets/images/placeholder-1.svg" },
    { caption: "Late nights at the lab, IISc", image: "assets/images/placeholder-2.svg" },
    { caption: "Old Delhi, winter morning", image: "assets/images/placeholder-3.svg" }
  ],

  // ---------------------------------------------------------------------
  // CHAPTER 9 — CONTACT
  // ---------------------------------------------------------------------
  contact: {
    email: "hello@aaravmehta.dev",
    github: "https://github.com/example",
    linkedin: "https://linkedin.com/in/example",
    resume: "assets/resume.pdf",
    note: `If something in these pages resonated — a project, an idea, a shared
    obsession with making systems boring in the good way — I'd like to hear from you.`
  },

  // ---------------------------------------------------------------------
  // FINAL CHAPTER — THE FUTURE
  // ---------------------------------------------------------------------
  closing: {
    line: "The story is still being written…",
    sub: "Thank you for reading this far. Come back — there will be new chapters."
  }
};
