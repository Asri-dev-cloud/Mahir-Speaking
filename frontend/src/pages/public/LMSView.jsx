import React, { useMemo, useState } from "react";
import confetti from "canvas-confetti";
import {
  ArrowLeft,
  ArrowRight,
  Award,
  BookOpen,
  Bookmark,
  Check,
  CheckCircle2,
  ChevronRight,
  Clock3,
  Coffee,
  Compass,
  Flame,
  GraduationCap,
  Headphones,
  HeartPulse,
  HelpCircle,
  Lock,
  Map,
  MessageCircle,
  Mic,
  Pause,
  Play,
  RotateCcw,
  ShoppingBag,
  Sparkles,
  Target,
  Trophy,
  UserRound,
  UsersRound,
  Volume2,
  X,
  Zap,
} from "lucide-react";
import { useAuth } from "../../context/AuthContext";

const lessons = [
  {
    id: 1,
    level: "A1",
    phase: "Survive",
    title: "Hello! Let’s Introduce Ourselves",
    shortTitle: "Self Introduction",
    icon: UserRound,
    duration: 25,
    xp: 80,
    color: "from-blue-600 to-blue-800",
    mission: "Memperkenalkan diri selama 30–45 detik dengan percaya diri.",
    description:
      "Mulai percakapan, menyebutkan nama, asal, kesibukan, dan menanggapi perkenalan secara alami.",
    objectives: [
      "Menyapa secara formal dan santai",
      "Menyebutkan nama, asal, dan kesibukan",
      "Menanyakan informasi dasar dengan sopan",
    ],
    vocabulary: [
      ["Good morning", "Selamat pagi", "Good morning, everyone."],
      ["My name is…", "Nama saya…", "My name is Fajar."],
      ["I’m from…", "Saya berasal dari…", "I’m from Cianjur."],
      ["What do you do?", "Apa kesibukanmu?", "What do you do, Rina?"],
      ["Nice to meet you", "Senang bertemu denganmu", "Nice to meet you too."],
    ],
    expressions: [
      "Hi, I’m ___.",
      "I’m from ___.",
      "I’m a student / fresh graduate / job seeker.",
      "In my free time, I like ___.",
      "Nice to meet you.",
    ],
    grammar: {
      title: "To be: am, is, are",
      points: [
        "I am / I’m Dinda.",
        "She is / She’s a student.",
        "You are / You’re very friendly.",
        "Are you a student? Is she from Bandung?",
      ],
    },
    pronunciation:
      "Latih contractions agar terdengar alami: I am → I’m, you are → you’re, she is → she’s.",
    dialogue: [
      ["Alya", "Hi! My name is Alya. What’s your name?"],
      ["Raka", "Hello, Alya. I’m Raka. Nice to meet you."],
      ["Alya", "Nice to meet you too. Where are you from?"],
      ["Raka", "I’m from Bandung. I’m a university student."],
    ],
    quiz: {
      question: "Complete the sentence: “I ___ from Bandung.”",
      options: ["am", "is", "are"],
      answer: 0,
      explanation: "Gunakan “am” setelah subjek I.",
    },
  },
  {
    id: 2,
    level: "A1",
    phase: "Survive",
    title: "My Daily Routine",
    shortTitle: "Daily Routine",
    icon: Clock3,
    duration: 25,
    xp: 80,
    color: "from-sky-500 to-blue-700",
    mission: "Menceritakan rutinitas harian dari pagi sampai malam.",
    description:
      "Gunakan aktivitas harian, jam, dan frequency words untuk menceritakan kebiasaanmu.",
    objectives: [
      "Menyebutkan aktivitas sehari-hari",
      "Menggunakan penanda waktu",
      "Menanyakan kebiasaan orang lain",
    ],
    vocabulary: [
      ["wake up", "bangun tidur", "I wake up at five."],
      ["have breakfast", "sarapan", "We have breakfast together."],
      [
        "go to school/work",
        "pergi sekolah/kerja",
        "She goes to work at eight.",
      ],
      ["study", "belajar", "I study English every day."],
      ["go to bed", "tidur", "I go to bed before eleven."],
    ],
    expressions: [
      "I usually wake up at ___.",
      "After that, I ___.",
      "I go to ___ at ___.",
      "In the evening, I ___.",
      "I go to bed at ___.",
    ],
    grammar: {
      title: "Simple Present",
      points: [
        "I/You/We/They study every day.",
        "He/She studies every day.",
        "Do you work? Does she study?",
        "Frequency: always, usually, often, sometimes, never.",
      ],
    },
    pronunciation:
      "Final -s dapat berbunyi /s/ pada works, /z/ pada plays, dan /ɪz/ pada watches.",
    dialogue: [
      ["Nisa", "What time do you usually wake up?"],
      ["Bimo", "I usually wake up at five thirty. How about you?"],
      ["Nisa", "I wake up at six. Then I take a shower and have breakfast."],
      ["Bimo", "Do you study English every day?"],
    ],
    quiz: {
      question: "Choose the correct sentence.",
      options: [
        "She study English.",
        "She studies English.",
        "She studying English.",
      ],
      answer: 1,
      explanation: "Untuk she/he/it, kata kerja Simple Present memakai -s/-es.",
    },
  },
  {
    id: 3,
    level: "A1",
    phase: "Survive",
    title: "Family & People Around Me",
    shortTitle: "Family & People",
    icon: UsersRound,
    duration: 25,
    xp: 90,
    color: "from-blue-500 to-indigo-700",
    mission: "Mendeskripsikan satu anggota keluarga atau teman dekat.",
    description:
      "Ceritakan hubungan, penampilan, dan karakter orang terdekat menggunakan kalimat sederhana.",
    objectives: [
      "Menyebutkan hubungan keluarga",
      "Mendeskripsikan penampilan dan karakter",
      "Menggunakan possessive adjectives",
    ],
    vocabulary: [
      ["parents", "orang tua", "My parents live in Cianjur."],
      ["siblings", "saudara kandung", "I have two siblings."],
      ["friendly", "ramah", "He is friendly and helpful."],
      ["hard-working", "pekerja keras", "My mother is hard-working."],
      ["wears glasses", "memakai kacamata", "My friend wears glasses."],
    ],
    expressions: [
      "This is my ___.",
      "His/Her name is ___.",
      "He/She is ___ and ___.",
      "He/She has ___.",
      "I like spending time with him/her because ___.",
    ],
    grammar: {
      title: "Possessive adjectives",
      points: [
        "my dan your",
        "his dan her",
        "our dan their",
        "What is she like? berbeda dengan What does she look like?",
      ],
    },
    pronunciation:
      "Latih bunyi /ð/ pada this, mother, dan brother dengan ujung lidah ringan di antara gigi.",
    dialogue: [
      ["Dita", "Do you have any brothers or sisters?"],
      ["Reno", "Yes. I have one older sister. Her name is Maya."],
      ["Dita", "What is she like?"],
      ["Reno", "She is friendly, patient, and very hard-working."],
    ],
    quiz: {
      question: "Maya is my sister. ___ hobby is reading.",
      options: ["His", "Her", "Their"],
      answer: 1,
      explanation: "Gunakan “her” untuk kepemilikan perempuan.",
    },
  },
  {
    id: 4,
    level: "A1",
    phase: "Connect",
    title: "Food, Drinks & Ordering",
    shortTitle: "Ordering Food",
    icon: Coffee,
    duration: 30,
    xp: 100,
    color: "from-orange-400 to-orange-600",
    mission: "Memesan makanan atau minuman dengan sopan.",
    description:
      "Berlatih membaca menu, meminta rekomendasi, memesan, dan meminta tagihan.",
    objectives: [
      "Menyebutkan makanan dan minuman",
      "Memesan serta meminta tambahan",
      "Menanyakan harga dan rekomendasi",
    ],
    vocabulary: [
      ["menu", "daftar menu", "Could I see the menu?"],
      ["recommend", "merekomendasikan", "What do you recommend?"],
      ["spicy", "pedas", "Is this dish spicy?"],
      ["without", "tanpa", "Tea without sugar, please."],
      ["bill / check", "tagihan", "Could we have the bill?"],
    ],
    expressions: [
      "Could I see the menu?",
      "I’d like ___, please.",
      "Could I have it without ___?",
      "What do you recommend?",
      "Could we have the bill, please?",
    ],
    grammar: {
      title: "Countable & uncountable nouns",
      points: [
        "an apple, two sandwiches, many cups",
        "water, rice, milk, sugar",
        "some rice dan some water",
        "Could I have…? / I’d like… / Can I get…?",
      ],
    },
    pronunciation:
      "Gunakan intonasi lembut dan tekankan kata utama: Could I have the CHICKEN rice, please?",
    dialogue: [
      ["Server", "Good afternoon. Are you ready to order?"],
      ["Customer", "Yes. Could I have the chicken rice, please?"],
      ["Server", "Would you like anything to drink?"],
      ["Customer", "An iced tea without sugar, please."],
    ],
    quiz: {
      question: "Which sentence is the most polite?",
      options: ["Give me coffee.", "I’d like a coffee, please.", "Coffee now."],
      answer: 1,
      explanation: "“I’d like…, please” adalah bentuk permintaan yang sopan.",
    },
  },
  {
    id: 5,
    level: "A1",
    phase: "Connect",
    title: "Around Town & Directions",
    shortTitle: "Directions",
    icon: Compass,
    duration: 30,
    xp: 100,
    color: "from-cyan-500 to-blue-700",
    mission: "Menanyakan dan memberikan arah menuju suatu tempat.",
    description:
      "Gunakan lokasi, patokan, dan instruksi sederhana untuk bernavigasi di kota.",
    objectives: [
      "Menyebutkan tempat umum",
      "Menggunakan prepositions of place",
      "Memberi petunjuk arah sederhana",
    ],
    vocabulary: [
      ["turn left / right", "belok kiri / kanan", "Turn left at the bank."],
      ["go straight", "jalan lurus", "Go straight for 200 metres."],
      ["next to", "di sebelah", "The café is next to the pharmacy."],
      ["across from", "di seberang", "It is across from the park."],
      ["between", "di antara", "The ATM is between two shops."],
    ],
    expressions: [
      "Excuse me, where is ___?",
      "Go straight for ___.",
      "Turn left/right at ___.",
      "It’s next to/across from ___.",
      "It’s about ___ minutes from here.",
    ],
    grammar: {
      title: "There is / There are",
      points: [
        "There is a bank nearby.",
        "There are two cafés.",
        "Is there a station? Are there any shops?",
        "Go straight. Turn right. Cross the street.",
      ],
    },
    pronunciation:
      "Hubungkan kata secara halus: turn_left, go_straight, next_to.",
    dialogue: [
      ["Visitor", "Excuse me, is there a pharmacy near here?"],
      ["Local", "Yes. Go straight and turn left at the traffic light."],
      ["Visitor", "Is it far from here?"],
      ["Local", "No. It’s about a five-minute walk."],
    ],
    quiz: {
      question: "The café is ___ the bank and the pharmacy.",
      options: ["between", "under", "inside"],
      answer: 0,
      explanation: "“Between” berarti berada di antara dua tempat.",
    },
  },
  {
    id: 6,
    level: "A1",
    phase: "Connect",
    title: "Shopping & Making Choices",
    shortTitle: "Shopping",
    icon: ShoppingBag,
    duration: 30,
    xp: 110,
    color: "from-amber-400 to-orange-600",
    mission: "Menanyakan ukuran, warna, harga, dan memilih produk.",
    description:
      "Bandingkan produk, tanyakan ukuran, dan lakukan keputusan pembelian dengan percaya diri.",
    objectives: [
      "Menanyakan harga dan ukuran",
      "Membandingkan dua produk",
      "Mengutarakan pilihan dengan sopan",
    ],
    vocabulary: [
      ["How much is it?", "Berapa harganya?", "How much is this shirt?"],
      ["size", "ukuran", "Do you have this in size M?"],
      ["try on", "mencoba pakaian", "Can I try this on?"],
      ["comfortable", "nyaman", "These shoes are comfortable."],
      ["I’ll take it", "Saya akan membelinya", "It looks good. I’ll take it."],
    ],
    expressions: [
      "How much is this?",
      "Do you have it in ___?",
      "Can I try it on?",
      "This one is ___ than that one.",
      "It fits well. I’ll take it.",
    ],
    grammar: {
      title: "Comparatives",
      points: [
        "cheap → cheaper",
        "easy → easier",
        "comfortable → more comfortable",
        "This bag is cheaper than that one.",
      ],
    },
    pronunciation:
      "Bedakan thirteen dan thirty. Tekanan thirteen di akhir, sedangkan thirty di awal.",
    dialogue: [
      ["Assistant", "Can I help you?"],
      ["Customer", "Do you have this jacket in blue?"],
      ["Assistant", "Yes. What size do you need?"],
      ["Customer", "Medium, please. Can I try it on?"],
    ],
    quiz: {
      question: "This bag is ___ than that bag.",
      options: ["cheap", "cheaper", "cheapest"],
      answer: 1,
      explanation:
        "Gunakan comparative “cheaper” ketika membandingkan dua benda.",
    },
  },
  {
    id: 7,
    level: "A2",
    phase: "Connect",
    title: "Plans & Invitations",
    shortTitle: "Plans & Invitations",
    icon: MessageCircle,
    duration: 30,
    xp: 110,
    color: "from-blue-600 to-violet-700",
    mission: "Mengajak teman dan menyusun rencana akhir pekan.",
    description:
      "Buat undangan, terima atau tolak dengan sopan, lalu tentukan waktu dan tempat.",
    objectives: [
      "Mengutarakan rencana",
      "Mengundang serta menanggapi undangan",
      "Menentukan waktu dan tempat",
    ],
    vocabulary: [
      [
        "Are you free…?",
        "Apakah kamu senggang…?",
        "Are you free this Saturday?",
      ],
      [
        "Would you like to…?",
        "Apakah kamu mau…?",
        "Would you like to watch a movie?",
      ],
      ["sounds great", "terdengar bagus", "That sounds great!"],
      ["maybe another time", "mungkin lain kali", "Sorry, maybe another time."],
      ["available", "tersedia/senggang", "I’m available after three."],
    ],
    expressions: [
      "Are you free ___?",
      "Would you like to ___?",
      "I’d love to / Sorry, I can’t.",
      "How about ___ o’clock?",
      "I’m going to ___ this weekend.",
    ],
    grammar: {
      title: "Be going to",
      points: [
        "I’m going to study tonight.",
        "He/She is going to…",
        "What are you going to do?",
        "Gunakan will untuk keputusan spontan.",
      ],
    },
    pronunciation:
      "Dalam percakapan santai, going to sering terdengar seperti “gonna”.",
    dialogue: [
      ["Sari", "Are you free this Saturday afternoon?"],
      ["Kevin", "Yes, I am. Why?"],
      ["Sari", "Would you like to practise English at the library?"],
      ["Kevin", "That sounds great. How about two o’clock?"],
    ],
    quiz: {
      question: "I’m going to ___ my friend.",
      options: ["meet", "meets", "met"],
      answer: 0,
      explanation: "Setelah going to, gunakan kata kerja bentuk dasar.",
    },
  },
  {
    id: 8,
    level: "A2",
    phase: "Grow",
    title: "Past Experiences & Stories",
    shortTitle: "Past Stories",
    icon: BookOpen,
    duration: 35,
    xp: 120,
    color: "from-indigo-600 to-blue-900",
    mission: "Menceritakan pengalaman yang terjadi minggu lalu.",
    description:
      "Susun cerita singkat menggunakan simple past dan sequence words.",
    objectives: [
      "Menggunakan simple past",
      "Menyusun cerita berurutan",
      "Menanyakan pengalaman lampau",
    ],
    vocabulary: [
      ["yesterday", "kemarin", "I stayed home yesterday."],
      ["last week", "minggu lalu", "We travelled last week."],
      ["went", "pergi", "We went to the beach."],
      ["saw", "melihat", "I saw a beautiful sunset."],
      [
        "first / then / finally",
        "pertama / lalu / akhirnya",
        "First, we had breakfast.",
      ],
    ],
    expressions: [
      "Last ___, I went to ___.",
      "First, we ___.",
      "Then, we ___.",
      "The best part was ___.",
      "Finally, we ___. It was ___.",
    ],
    grammar: {
      title: "Simple Past",
      points: [
        "visit → visited",
        "go → went; see → saw; have → had",
        "Did you enjoy it?",
        "I didn’t go. Bukan I didn’t went.",
      ],
    },
    pronunciation: "Past -ed: /t/ watched, /d/ played, dan /ɪd/ visited.",
    dialogue: [
      ["Tia", "What did you do last weekend?"],
      ["Doni", "I went to a small beach with my cousins."],
      ["Tia", "What did you do there?"],
      ["Doni", "We swam, took photos, and watched the sunset."],
    ],
    quiz: {
      question: "Yesterday, I ___ to the market.",
      options: ["go", "went", "gone"],
      answer: 1,
      explanation: "“Went” adalah bentuk lampau dari go.",
    },
  },
  {
    id: 9,
    level: "A2",
    phase: "Grow",
    title: "Health & Asking for Help",
    shortTitle: "Health & Help",
    icon: HeartPulse,
    duration: 30,
    xp: 120,
    color: "from-rose-500 to-orange-600",
    mission: "Menjelaskan keluhan ringan dan meminta bantuan.",
    description:
      "Sebutkan gejala, berikan saran, dan minta bantuan dengan kalimat pendek yang jelas.",
    objectives: [
      "Menyebutkan keluhan umum",
      "Memberi saran sederhana",
      "Meminta bantuan dengan jelas",
    ],
    vocabulary: [
      ["headache", "sakit kepala", "I have a headache."],
      ["sore throat", "sakit tenggorokan", "She has a sore throat."],
      ["dizzy", "pusing", "I feel dizzy."],
      ["rest", "beristirahat", "You should get some rest."],
      ["need help", "butuh bantuan", "Excuse me, I need help."],
    ],
    expressions: [
      "I don’t feel well.",
      "I have ___.",
      "I feel ___.",
      "You should ___.",
      "Could you help me find ___?",
    ],
    grammar: {
      title: "Should / shouldn’t",
      points: [
        "You should rest.",
        "You shouldn’t stay up late.",
        "Setelah should gunakan bentuk dasar.",
        "I have a headache / I feel dizzy.",
      ],
    },
    pronunciation:
      "Tekankan informasi penting saat meminta bantuan: I NEED help. I feel DIZZY.",
    dialogue: [
      ["Friend", "You don’t look well. What’s wrong?"],
      ["Rani", "I have a headache and I feel dizzy."],
      ["Friend", "You should sit down and drink some water."],
      ["Rani", "Thank you. Is there a clinic nearby?"],
    ],
    quiz: {
      question: "You ___ drink more water.",
      options: ["should", "should to", "are should"],
      answer: 0,
      explanation: "Should langsung diikuti bentuk dasar tanpa “to”.",
    },
  },
  {
    id: 10,
    level: "A2",
    phase: "Grow",
    title: "Study, Work & Responsibilities",
    shortTitle: "Study & Work",
    icon: GraduationCap,
    duration: 35,
    xp: 130,
    color: "from-blue-700 to-slate-900",
    mission: "Menjelaskan tugas, kemampuan, dan tanggung jawab.",
    description:
      "Ceritakan studi atau pekerjaan, keterampilan yang dikuasai, dan kewajibanmu.",
    objectives: [
      "Mendeskripsikan pekerjaan atau studi",
      "Menjelaskan kemampuan",
      "Membicarakan kewajiban",
    ],
    vocabulary: [
      [
        "responsible for",
        "bertanggung jawab atas",
        "I’m responsible for social media.",
      ],
      ["task", "tugas", "My main task is writing content."],
      ["deadline", "tenggat waktu", "The deadline is Friday."],
      ["have to", "harus", "I have to finish this today."],
      ["improve", "meningkatkan", "I want to improve my speaking."],
    ],
    expressions: [
      "I’m a student/intern at ___.",
      "I’m responsible for ___.",
      "My main task is ___.",
      "I can ___, but I can’t ___ yet.",
      "I have to ___ before ___.",
    ],
    grammar: {
      title: "Can & have to",
      points: [
        "I can design a website.",
        "I can’t speak fluently yet.",
        "I have to submit the report.",
        "Don’t have to berarti tidak wajib.",
      ],
    },
    pronunciation:
      "Can biasanya lemah, sedangkan can’t menerima tekanan: I can DESIGN, but I CAN’T code it yet.",
    dialogue: [
      ["Mentor", "What are you responsible for during your internship?"],
      ["Learner", "I’m responsible for website content and simple automation."],
      ["Mentor", "What tools can you use?"],
      ["Learner", "I can use HTML, CSS, and basic JavaScript."],
    ],
    quiz: {
      question: "We ___ finish the project today.",
      options: ["have to", "has to", "having"],
      answer: 0,
      explanation: "Subjek we menggunakan “have to”.",
    },
  },
  {
    id: 11,
    level: "A2",
    phase: "Grow",
    title: "Job Interview Basics",
    shortTitle: "Job Interview",
    icon: Award,
    duration: 40,
    xp: 150,
    color: "from-orange-500 to-amber-700",
    mission: "Menjawab tiga pertanyaan interview dasar.",
    description:
      "Buat elevator pitch, jelaskan kekuatan, dan jawab menggunakan PREP sederhana.",
    objectives: [
      "Membuat elevator pitch",
      "Menjelaskan kekuatan dan pengalaman",
      "Menjawab dengan struktur PREP",
    ],
    vocabulary: [
      ["experience", "pengalaman", "I have experience in content creation."],
      ["strength", "kekuatan", "My strength is problem-solving."],
      ["achievement", "pencapaian", "My achievement was leading a project."],
      ["learn quickly", "belajar cepat", "I learn new tools quickly."],
      ["contribute", "berkontribusi", "I can contribute creative ideas."],
    ],
    expressions: [
      "I’m a ___ with an interest in ___.",
      "I have experience in ___.",
      "My main strength is ___.",
      "For example, I ___.",
      "I want this role because ___.",
    ],
    grammar: {
      title: "Present perfect—basic use",
      points: [
        "I have worked on two projects.",
        "I have created several designs.",
        "I created it last month.",
        "PREP: Point, Reason, Example, Point.",
      ],
    },
    pronunciation:
      "Bagi jawaban panjang menjadi thought groups dan beri jeda singkat pada setiap kelompok makna.",
    dialogue: [
      ["Interviewer", "Tell me about yourself."],
      ["Candidate", "I’m a final-year student interested in web development."],
      ["Interviewer", "What is one of your strengths?"],
      ["Candidate", "My main strength is learning quickly."],
    ],
    quiz: {
      question: "I have ___ two websites.",
      options: ["build", "built", "building"],
      answer: 1,
      explanation: "Present perfect menggunakan have/has + past participle.",
    },
  },
  {
    id: 12,
    level: "A2",
    phase: "Perform",
    title: "Final Speaking Project",
    shortTitle: "Final Project",
    icon: Trophy,
    duration: 45,
    xp: 250,
    color: "from-[#0362C0] via-blue-700 to-slate-950",
    mission: "Presentasi 2 menit tentang diri, pengalaman, dan rencana.",
    description:
      "Gabungkan seluruh kemampuan dari Unit 1–11 menjadi presentasi terstruktur.",
    objectives: [
      "Menggabungkan materi Unit 1–11",
      "Menyusun pembuka, isi, dan penutup",
      "Menilai perkembangan speaking",
    ],
    vocabulary: [
      [
        "first of all",
        "pertama-tama",
        "First of all, let me introduce myself.",
      ],
      ["currently", "saat ini", "I’m currently studying informatics."],
      ["in the future", "di masa depan", "In the future, I want to…"],
      ["overall", "secara keseluruhan", "Overall, I feel more confident."],
      [
        "thank you for listening",
        "terima kasih telah mendengarkan",
        "Thank you for listening.",
      ],
    ],
    expressions: [
      "First of all, let me introduce myself.",
      "Currently, I ___.",
      "One experience I’m proud of is ___.",
      "In the future, I’m going to ___.",
      "Overall, ___. Thank you for listening.",
    ],
    grammar: {
      title: "Review & sentence linking",
      points: [
        "and untuk menambah informasi",
        "but/however untuk kontras",
        "because untuk alasan",
        "Gunakan past, present, dan future sesuai konteks.",
      ],
    },
    pronunciation:
      "Utamakan pesan, jeda alami, dan kejelasan. Fluency lebih penting daripada berbicara terlalu cepat.",
    dialogue: [
      ["Speaker", "Good morning. First of all, let me introduce myself."],
      ["Speaker", "I’m currently studying information technology."],
      [
        "Speaker",
        "One experience I’m proud of is completing my first website.",
      ],
      ["Speaker", "Thank you for listening."],
    ],
    quiz: {
      question: "What is the main goal of the final project?",
      options: [
        "Perfect accent",
        "Clear confident communication",
        "Speaking very fast",
      ],
      answer: 1,
      explanation:
        "Target utama adalah komunikasi yang jelas dan percaya diri.",
    },
  },
];

const sectionTabs = [
  ["overview", "Overview", Map],
  ["vocabulary", "Vocabulary", BookOpen],
  ["conversation", "Conversation", MessageCircle],
  ["practice", "Practice", Mic],
  ["quiz", "Quick Quiz", HelpCircle],
];

export default function LMSView() {
  const { user, setActiveTab } = useAuth();
  const [filter, setFilter] = useState("ALL");
  const [selectedLesson, setSelectedLesson] = useState(null);
  const [lessonTab, setLessonTab] = useState("overview");
  const [completedIds, setCompletedIds] = useState([1, 2]);
  const [bookmarkedIds, setBookmarkedIds] = useState([]);
  const [quizChoice, setQuizChoice] = useState(null);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [isRecording, setIsRecording] = useState(false);
  const [recordingResult, setRecordingResult] = useState("");
  const [showAllUnits, setShowAllUnits] = useState(false);

  const filteredLessons = useMemo(() => {
    if (filter === "ALL") return lessons;
    return lessons.filter(
      (lesson) => lesson.level === filter || lesson.phase === filter,
    );
  }, [filter]);

  const progress = Math.round((completedIds.length / lessons.length) * 100);
  const currentLesson =
    lessons.find((lesson) => !completedIds.includes(lesson.id)) ||
    lessons[lessons.length - 1];
  const visibleLessons = showAllUnits
    ? filteredLessons
    : filteredLessons.slice(0, 8);

  const openLesson = (lesson) => {
    setSelectedLesson(lesson);
    setLessonTab("overview");
    setQuizChoice(null);
    setRecordingResult("");
    window.speechSynthesis?.cancel();
    setIsSpeaking(false);
  };

  const closeLesson = () => {
    window.speechSynthesis?.cancel();
    setIsSpeaking(false);
    setSelectedLesson(null);
  };

  const playText = (text) => {
    if (!("speechSynthesis" in window)) return;
    window.speechSynthesis.cancel();
    const speech = new SpeechSynthesisUtterance(text);
    speech.lang = "en-US";
    speech.rate = 0.88;
    speech.onend = () => setIsSpeaking(false);
    speech.onerror = () => setIsSpeaking(false);
    setIsSpeaking(true);
    window.speechSynthesis.speak(speech);
  };

  const startRecording = () => {
    const SpeechRecognition =
      window.SpeechRecognition || window.webkitSpeechRecognition;

    if (!SpeechRecognition) {
      setRecordingResult(
        "Gunakan Chrome dan aktifkan izin mikrofon untuk mencoba fitur ini.",
      );
      return;
    }

    const recognition = new SpeechRecognition();
    recognition.lang = "en-US";
    recognition.interimResults = false;
    recognition.maxAlternatives = 1;
    recognition.onstart = () => {
      setIsRecording(true);
      setRecordingResult("Mendengarkan...");
    };
    recognition.onresult = (event) => {
      setRecordingResult(`Terdengar: “${event.results[0][0].transcript}”`);
    };
    recognition.onerror = () => {
      setRecordingResult(
        "Suara belum terbaca. Coba bicara lebih dekat ke mikrofon.",
      );
    };
    recognition.onend = () => setIsRecording(false);
    recognition.start();
  };

  const toggleBookmark = (lessonId) => {
    setBookmarkedIds((ids) =>
      ids.includes(lessonId)
        ? ids.filter((id) => id !== lessonId)
        : [...ids, lessonId],
    );
  };

  const finishLesson = () => {
    if (!selectedLesson || completedIds.includes(selectedLesson.id)) return;
    setCompletedIds((ids) => [...ids, selectedLesson.id]);
    confetti({
      particleCount: 90,
      spread: 70,
      origin: { y: 0.72 },
      colors: ["#0362C0", "#FFFF00", "#FFA715", "#87CEFA"],
    });
  };

  return (
    <div className="min-h-screen overflow-x-hidden bg-[#EAF6FF] text-slate-950">
      <section className="mx-auto max-w-[1440px] px-3 sm:px-6 lg:px-8 py-4 sm:py-8">
        <div className="relative overflow-hidden rounded-[28px] bg-gradient-to-br from-[#0362C0] via-blue-700 to-slate-950 p-5 text-white shadow-2xl sm:rounded-[40px] sm:p-9 lg:p-12 border border-white/20">
          <div className="pointer-events-none absolute -right-20 -top-24 h-72 w-72 rounded-full bg-[#87CEFA]/25 blur-3xl" />
          <div className="pointer-events-none absolute -bottom-28 left-1/3 h-64 w-64 rounded-full bg-[#FFFF00]/15 blur-3xl" />

          <div className="relative grid items-center gap-8 lg:grid-cols-[1.2fr_.8fr]">
            <div>
              <div className="inline-flex items-center gap-2 rounded-full bg-[#FFFF00] px-3 py-1.5 text-[10px] font-black uppercase tracking-wider text-[#0362C0] sm:text-xs">
                <Sparkles className="h-4 w-4" />
                Speaking Starter Kit • A1–A2
              </div>
              <h1 className="mt-5 max-w-4xl font-stinger text-4xl font-black uppercase leading-[0.94] sm:text-6xl lg:text-7xl">
                Belajar sedikit.
                <span className="block text-[#FFFF00]">
                  Berani bicara setiap hari.
                </span>
              </h1>
              <p className="mt-5 max-w-2xl font-poppins text-sm leading-7 text-blue-100 sm:text-base">
                Jalur belajar 12 misi dengan vocabulary, dialog, pronunciation,
                latihan suara, dan evaluasi singkat—dibuat supaya kamu terus
                aktif, bukan cuma membaca materi.
              </p>

              <div className="mt-7 flex flex-col gap-3 sm:flex-row">
                <button
                  type="button"
                  onClick={() => openLesson(currentLesson)}
                  className="group inline-flex min-h-12 items-center justify-center gap-2 rounded-2xl bg-[#FFFF00] px-6 py-3 text-sm font-black text-[#0362C0] transition hover:-translate-y-1"
                >
                  <Play className="h-4 w-4 fill-current" />
                  Lanjutkan Unit {currentLesson.id}
                  <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
                </button>
                <button
                  type="button"
                  onClick={() => setActiveTab("ai-chat")}
                  className="inline-flex min-h-12 items-center justify-center gap-2 rounded-2xl border border-white/20 bg-white/10 px-6 py-3 text-sm font-black text-white backdrop-blur transition hover:bg-white/20"
                >
                  <MessageCircle className="h-4 w-4 text-[#FFFF00]" />
                  Latihan dengan Mashira
                </button>
              </div>
            </div>

            <div className="relative hidden min-h-[290px] lg:block">
              <div className="absolute inset-4 rounded-full border border-dashed border-white/30" />
              <img
                src="/4.png"
                alt="Mashira, AI speaking companion"
                className="absolute bottom-0 left-1/2 h-[330px] w-auto -translate-x-1/2 object-contain drop-shadow-2xl"
              />
              <div className="absolute right-0 top-2 rounded-2xl bg-white p-3 text-xs font-black text-[#0362C0] shadow-xl">
                “Siap lanjut latihan?”
              </div>
            </div>
          </div>

          <div className="relative mt-8 grid grid-cols-2 gap-3 border-t border-white/15 pt-6 sm:grid-cols-4">
            {[
              ["12", "Speaking Missions"],
              ["A1–A2", "CEFR Basic Path"],
              ["30 Hari", "Habit Tracker"],
              ["4 Skills", "Speaking Rubric"],
            ].map(([value, label]) => (
              <div
                key={label}
                className="rounded-2xl border border-white/15 bg-white/10 p-3 backdrop-blur sm:p-4"
              >
                <div className="text-xl font-black text-[#FFFF00] sm:text-2xl">
                  {value}
                </div>
                <div className="mt-1 text-[9px] font-bold uppercase tracking-wide text-blue-100 sm:text-xs">
                  {label}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-[1440px] px-3 sm:px-6 lg:px-8">
        <div className="grid gap-4 lg:grid-cols-[1.5fr_.5fr]">
          <div className="rounded-[26px] border border-white bg-white p-5 shadow-lg shadow-blue-700/5 sm:p-6">
            <div className="flex flex-col gap-5 sm:flex-row sm:items-center">
              <div className="relative grid h-20 w-20 shrink-0 place-items-center rounded-full bg-blue-50">
                <div
                  className="absolute inset-0 rounded-full"
                  style={{
                    background: `conic-gradient(#0362C0 ${progress * 3.6}deg, #DBEAFE 0deg)`,
                  }}
                />
                <div className="relative grid h-14 w-14 place-items-center rounded-full bg-white text-sm font-black text-[#0362C0]">
                  {progress}%
                </div>
              </div>
              <div className="min-w-0 flex-1">
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <div>
                    <div className="text-[10px] font-black uppercase tracking-[0.18em] text-[#0362C0]">
                      Progress belajar
                    </div>
                    <h2 className="mt-1 font-helios text-xl font-black sm:text-2xl">
                      Halo, {user?.full_name || "Learner"}!
                    </h2>
                  </div>
                  <span className="rounded-full bg-blue-50 px-3 py-1.5 text-xs font-black text-[#0362C0]">
                    {completedIds.length}/{lessons.length} unit selesai
                  </span>
                </div>
                <div className="mt-4 h-3 overflow-hidden rounded-full bg-slate-100">
                  <div
                    className="h-full rounded-full bg-gradient-to-r from-[#0362C0] to-[#87CEFA] transition-all duration-700"
                    style={{ width: `${progress}%` }}
                  />
                </div>
                <p className="mt-2 text-xs font-medium text-slate-500">
                  Berikutnya: Unit {currentLesson.id} •{" "}
                  {currentLesson.shortTitle}
                </p>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3 rounded-[26px] bg-slate-950 p-4 text-white shadow-xl">
            <div className="rounded-2xl bg-white/5 p-4">
              <Flame className="h-5 w-5 text-[#FFA715]" />
              <div className="mt-3 text-2xl font-black">
                {user?.streak || 7}
              </div>
              <div className="text-[10px] font-bold uppercase text-slate-400">
                Day streak
              </div>
            </div>
            <div className="rounded-2xl bg-white/5 p-4">
              <Zap className="h-5 w-5 text-[#FFFF00]" />
              <div className="mt-3 text-2xl font-black">
                {user?.xp ||
                  completedIds.reduce((sum, id) => sum + lessons[id - 1].xp, 0)}
              </div>
              <div className="text-[10px] font-bold uppercase text-slate-400">
                Total XP
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="mx-auto mt-8 max-w-[1440px] px-3 sm:px-6 lg:px-8">
        <div className="sticky top-2 z-30 rounded-2xl border border-white bg-white/90 p-2 shadow-xl shadow-blue-900/5 backdrop-blur-xl">
          <div className="flex gap-2 overflow-x-auto [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
            {[
              ["ALL", "Semua Unit"],
              ["A1", "A1 Foundation"],
              ["A2", "A2 Elementary"],
              ["Survive", "Survive"],
              ["Connect", "Connect"],
              ["Grow", "Grow"],
            ].map(([value, label]) => (
              <button
                type="button"
                key={value}
                onClick={() => {
                  setFilter(value);
                  setShowAllUnits(false);
                }}
                className={`shrink-0 rounded-xl px-4 py-2.5 text-xs font-black transition ${filter === value
                  ? "bg-[#0362C0] text-white shadow-lg"
                  : "bg-slate-50 text-slate-600 hover:bg-blue-50 hover:text-[#0362C0]"
                  }`}
              >
                {label}
              </button>
            ))}
          </div>
        </div>
      </section>

      <section className="mx-auto mt-8 max-w-[1440px] px-3 sm:px-6 lg:px-8">
        <div className="mb-6 flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <div className="text-[10px] font-black uppercase tracking-[0.2em] text-[#0362C0]">
              Mission-based learning path
            </div>
            <h2 className="mt-2 font-stinger text-3xl font-black uppercase sm:text-5xl">
              Pilih misi belajarmu
            </h2>
          </div>
          <p className="max-w-lg text-sm leading-6 text-slate-600">
            Setiap unit punya aktivitas berbeda agar ritme belajar tetap segar:
            input, discovery, speaking, dan reflection.
          </p>
        </div>

        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
          {visibleLessons.map((lesson) => {
            const Icon = lesson.icon;
            const completed = completedIds.includes(lesson.id);
            const bookmarked = bookmarkedIds.includes(lesson.id);
            const unlocked =
              lesson.id === 1 ||
              user ||
              completedIds.includes(lesson.id - 1) ||
              lesson.id <= 3;

            return (
              <article
                key={lesson.id}
                className="group relative overflow-hidden rounded-[26px] border border-white bg-white shadow-lg shadow-blue-900/5 transition hover:-translate-y-1.5 hover:shadow-2xl"
              >
                <div className={`h-2 bg-gradient-to-r ${lesson.color}`} />
                <div className="p-5 sm:p-6">
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex items-center gap-3">
                      <div
                        className={`grid h-12 w-12 place-items-center rounded-2xl bg-gradient-to-br ${lesson.color} text-white shadow-lg`}
                      >
                        <Icon className="h-6 w-6" />
                      </div>
                      <div>
                        <div className="text-[10px] font-black uppercase tracking-widest text-[#0362C0]">
                          Unit {String(lesson.id).padStart(2, "0")} •{" "}
                          {lesson.level}
                        </div>
                        <div className="mt-1 flex items-center gap-2 text-[10px] font-bold text-slate-400">
                          <Clock3 className="h-3.5 w-3.5" />
                          {lesson.duration} menit
                          <span>•</span>+{lesson.xp} XP
                        </div>
                      </div>
                    </div>
                    <button
                      type="button"
                      onClick={() => toggleBookmark(lesson.id)}
                      aria-label={
                        bookmarked ? "Hapus dari tersimpan" : "Simpan materi"
                      }
                      className={`grid h-9 w-9 place-items-center rounded-xl transition ${bookmarked
                        ? "bg-[#FFFF00] text-[#0362C0]"
                        : "bg-slate-50 text-slate-400 hover:text-[#0362C0]"
                        }`}
                    >
                      <Bookmark
                        className={`h-4 w-4 ${bookmarked ? "fill-current" : ""}`}
                      />
                    </button>
                  </div>

                  <div className="mt-5">
                    <div className="mb-2 flex items-center gap-2">
                      <span className="rounded-full bg-blue-50 px-2.5 py-1 text-[9px] font-black uppercase text-[#0362C0]">
                        {lesson.phase}
                      </span>
                      {completed && (
                        <span className="inline-flex items-center gap-1 rounded-full bg-emerald-50 px-2.5 py-1 text-[9px] font-black uppercase text-emerald-700">
                          <CheckCircle2 className="h-3 w-3" />
                          Selesai
                        </span>
                      )}
                    </div>
                    <h3 className="font-helios text-xl font-black leading-tight transition group-hover:text-[#0362C0]">
                      {lesson.title}
                    </h3>
                    <p className="mt-3 min-h-[48px] text-xs font-medium leading-6 text-slate-600 sm:text-sm">
                      {lesson.description}
                    </p>
                  </div>

                  <div className="mt-5 rounded-2xl bg-[#EAF6FF] p-4">
                    <div className="flex items-start gap-3">
                      <Target className="mt-0.5 h-5 w-5 shrink-0 text-[#FFA715]" />
                      <div>
                        <div className="text-[9px] font-black uppercase tracking-wider text-[#0362C0]">
                          Final mission
                        </div>
                        <p className="mt-1 text-xs font-bold leading-5 text-slate-700">
                          {lesson.mission}
                        </p>
                      </div>
                    </div>
                  </div>

                  <button
                    type="button"
                    onClick={() =>
                      unlocked ? openLesson(lesson) : setActiveTab("pricing")
                    }
                    className={`mt-5 flex min-h-12 w-full items-center justify-center gap-2 rounded-2xl text-xs font-black transition ${unlocked
                      ? "bg-[#0362C0] text-white hover:-translate-y-0.5 hover:bg-blue-800"
                      : "border border-slate-200 bg-slate-50 text-slate-500"
                      }`}
                  >
                    {unlocked ? (
                      <>
                        <Play className="h-4 w-4 fill-current" />
                        {completed ? "Pelajari Lagi" : "Mulai Unit"}
                      </>
                    ) : (
                      <>
                        <Lock className="h-4 w-4" />
                        Buka dengan Paket
                      </>
                    )}
                  </button>
                </div>
              </article>
            );
          })}
        </div>

        {filteredLessons.length > 8 && (
          <div className="mt-7 text-center">
            <button
              type="button"
              onClick={() => setShowAllUnits((value) => !value)}
              className="rounded-2xl border-2 border-[#0362C0]/15 bg-white px-6 py-3 text-sm font-black text-[#0362C0] transition hover:border-[#0362C0] hover:bg-blue-50"
            >
              {showAllUnits ? "Tampilkan Lebih Sedikit" : "Lihat Semua 12 Unit"}
            </button>
          </div>
        )}
      </section>

      <section className="mx-auto mt-12 pb-12 sm:pb-20 max-w-[1440px] px-3 sm:px-6 lg:px-8">
        <div className="grid gap-4 lg:grid-cols-3">
          {[
            {
              icon: Headphones,
              label: "Listen & Shadow",
              title: "Tiru ritme, bukan hanya kata.",
              text: "Dengarkan contoh audio lalu ulangi dengan jeda dan intonasi yang sama.",
            },
            {
              icon: Mic,
              label: "Speak & Record",
              title: "Dengar kembali suaramu.",
              text: "Latihan mikrofon membantu kamu menyadari progres yang sering tidak terasa.",
            },
            {
              icon: Trophy,
              label: "Mission & Reward",
              title: "Selesaikan satu tujuan nyata.",
              text: "Setiap misi menghasilkan XP dan membuka langkah belajar berikutnya.",
            },
          ].map((item) => {
            const Icon = item.icon;
            return (
              <div
                key={item.label}
                className="rounded-[26px] bg-slate-950 p-6 text-white"
              >
                <div className="grid h-11 w-11 place-items-center rounded-2xl bg-[#FFFF00] text-[#0362C0]">
                  <Icon className="h-5 w-5" />
                </div>
                <div className="mt-5 text-[10px] font-black uppercase tracking-[0.18em] text-[#87CEFA]">
                  {item.label}
                </div>
                <h3 className="mt-2 text-xl font-black">{item.title}</h3>
                <p className="mt-2 text-sm leading-6 text-slate-400">
                  {item.text}
                </p>
              </div>
            );
          })}
        </div>
      </section>

      {selectedLesson && (
        <div
          className="fixed inset-0 z-50 flex items-end justify-center bg-slate-950/80 backdrop-blur-md sm:items-center sm:p-5"
          role="dialog"
          aria-modal="true"
          aria-label={`Materi ${selectedLesson.title}`}
        >
          <div className="flex h-[94vh] w-full max-w-6xl flex-col overflow-hidden rounded-t-[28px] bg-white shadow-2xl sm:h-[90vh] sm:rounded-[32px]">
            <div
              className={`relative bg-gradient-to-r ${selectedLesson.color} p-5 text-white sm:p-7`}
            >
              <div className="absolute inset-0 bg-slate-950/10" />
              <div className="relative flex items-start justify-between gap-4">
                <div className="flex min-w-0 items-start gap-3 sm:gap-4">
                  <button
                    type="button"
                    onClick={closeLesson}
                    className="grid h-10 w-10 shrink-0 place-items-center rounded-xl bg-white/15 transition hover:bg-white/25 sm:hidden"
                    aria-label="Kembali"
                  >
                    <ArrowLeft className="h-5 w-5" />
                  </button>
                  <div>
                    <div className="text-[10px] font-black uppercase tracking-[0.18em] text-white/75">
                      Unit {String(selectedLesson.id).padStart(2, "0")} •{" "}
                      {selectedLesson.level} • {selectedLesson.duration} menit
                    </div>
                    <h2 className="mt-2 font-stinger text-2xl font-black leading-tight sm:text-4xl">
                      {selectedLesson.title}
                    </h2>
                    <p className="mt-2 hidden max-w-3xl text-sm text-white/80 sm:block">
                      {selectedLesson.description}
                    </p>
                  </div>
                </div>
                <button
                  type="button"
                  onClick={closeLesson}
                  className="hidden h-10 w-10 shrink-0 place-items-center rounded-xl bg-white/15 transition hover:bg-white/25 sm:grid"
                  aria-label="Tutup materi"
                >
                  <X className="h-5 w-5" />
                </button>
              </div>
            </div>

            <div className="border-b border-slate-200 bg-white px-3 sm:px-6">
              <div className="flex gap-1 overflow-x-auto py-2 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
                {sectionTabs.map(([value, label, Icon]) => (
                  <button
                    type="button"
                    key={value}
                    onClick={() => setLessonTab(value)}
                    className={`inline-flex min-h-11 shrink-0 items-center gap-2 rounded-xl px-3 py-2 text-xs font-black transition sm:px-4 ${lessonTab === value
                      ? "bg-[#0362C0] text-white"
                      : "text-slate-500 hover:bg-blue-50 hover:text-[#0362C0]"
                      }`}
                  >
                    <Icon className="h-4 w-4" />
                    {label}
                  </button>
                ))}
              </div>
            </div>

            <div className="flex-1 overflow-y-auto bg-[#F7FBFF] p-4 sm:p-7">
              <div className="mx-auto max-w-4xl">
                {lessonTab === "overview" && (
                  <div className="grid gap-5 lg:grid-cols-[1.1fr_.9fr]">
                    <div className="rounded-[24px] bg-white p-5 shadow-sm sm:p-7">
                      <div className="text-[10px] font-black uppercase tracking-[0.18em] text-[#0362C0]">
                        By the end of this unit, I can…
                      </div>
                      <div className="mt-5 space-y-3">
                        {selectedLesson.objectives.map((objective) => (
                          <div
                            key={objective}
                            className="flex items-start gap-3 rounded-2xl bg-blue-50 p-4"
                          >
                            <CheckCircle2 className="mt-0.5 h-5 w-5 shrink-0 text-[#0362C0]" />
                            <span className="text-sm font-bold text-slate-700">
                              {objective}
                            </span>
                          </div>
                        ))}
                      </div>
                    </div>

                    <div className="rounded-[24px] bg-[#FFFF00] p-5 sm:p-7">
                      <div className="flex items-center gap-2 text-[#0362C0]">
                        <Target className="h-5 w-5" />
                        <span className="text-[10px] font-black uppercase tracking-[0.18em]">
                          Final speaking mission
                        </span>
                      </div>
                      <h3 className="mt-4 text-2xl font-black leading-tight text-slate-950">
                        {selectedLesson.mission}
                      </h3>
                      <p className="mt-4 text-sm font-medium leading-6 text-slate-700">
                        Pelajari setiap bagian, lalu rekam satu percobaan tanpa
                        menghentikan audio. Nilai clarity, fluency, accuracy,
                        dan confidence.
                      </p>
                      <button
                        type="button"
                        onClick={() => setLessonTab("practice")}
                        className="mt-6 inline-flex min-h-11 w-full items-center justify-center gap-2 rounded-2xl bg-[#0362C0] px-5 py-3 text-sm font-black text-white"
                      >
                        <Mic className="h-4 w-4" />
                        Menuju Speaking Practice
                      </button>
                    </div>

                    <div className="rounded-[24px] bg-white p-5 shadow-sm sm:p-7 lg:col-span-2">
                      <h3 className="font-helios text-xl font-black text-[#0362C0]">
                        Grammar for Speaking
                      </h3>
                      <h4 className="mt-1 font-black">
                        {selectedLesson.grammar.title}
                      </h4>
                      <div className="mt-4 grid gap-3 sm:grid-cols-2">
                        {selectedLesson.grammar.points.map((point) => (
                          <div
                            key={point}
                            className="flex items-start gap-2 rounded-xl border border-slate-200 p-3 text-sm text-slate-700"
                          >
                            <Check className="mt-0.5 h-4 w-4 shrink-0 text-[#0362C0]" />
                            {point}
                          </div>
                        ))}
                      </div>
                      <div className="mt-5 flex items-start gap-3 rounded-2xl bg-orange-50 p-4">
                        <Volume2 className="mt-0.5 h-5 w-5 shrink-0 text-[#FFA715]" />
                        <div>
                          <div className="text-[10px] font-black uppercase tracking-wider text-orange-700">
                            Pronunciation lab
                          </div>
                          <p className="mt-1 text-sm leading-6 text-slate-700">
                            {selectedLesson.pronunciation}
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                {lessonTab === "vocabulary" && (
                  <div>
                    <div className="mb-5">
                      <div className="text-[10px] font-black uppercase tracking-[0.18em] text-[#0362C0]">
                        Vocabulary in context
                      </div>
                      <h3 className="mt-2 text-2xl font-black">
                        Pelajari lewat contoh, bukan hafalan.
                      </h3>
                    </div>
                    <div className="grid gap-4 sm:grid-cols-2">
                      {selectedLesson.vocabulary.map(
                        ([word, meaning, example], index) => (
                          <article
                            key={word}
                            className="group rounded-[22px] border border-slate-200 bg-white p-5 shadow-sm transition hover:-translate-y-1 hover:border-[#0362C0]/40 hover:shadow-lg"
                          >
                            <div className="flex items-start justify-between gap-3">
                              <div>
                                <div className="text-[10px] font-black uppercase text-[#FFA715]">
                                  Word {index + 1}
                                </div>
                                <h4 className="mt-1 text-xl font-black text-[#0362C0]">
                                  {word}
                                </h4>
                                <p className="mt-1 text-xs font-bold text-slate-500">
                                  {meaning}
                                </p>
                              </div>
                              <button
                                type="button"
                                onClick={() => playText(`${word}. ${example}`)}
                                className="grid h-10 w-10 shrink-0 place-items-center rounded-xl bg-blue-50 text-[#0362C0] transition group-hover:bg-[#0362C0] group-hover:text-white"
                                aria-label={`Dengarkan ${word}`}
                              >
                                <Volume2 className="h-5 w-5" />
                              </button>
                            </div>
                            <p className="mt-4 rounded-xl bg-slate-50 p-3 text-sm font-medium italic leading-6 text-slate-700">
                              “{example}”
                            </p>
                          </article>
                        ),
                      )}
                    </div>
                  </div>
                )}

                {lessonTab === "conversation" && (
                  <div className="grid gap-5 lg:grid-cols-[1.15fr_.85fr]">
                    <div className="rounded-[24px] bg-white p-5 shadow-sm sm:p-7">
                      <div className="flex items-center justify-between gap-3">
                        <div>
                          <div className="text-[10px] font-black uppercase tracking-[0.18em] text-[#0362C0]">
                            Model conversation
                          </div>
                          <h3 className="mt-2 text-2xl font-black">
                            Baca dua peran.
                          </h3>
                        </div>
                        <button
                          type="button"
                          onClick={() =>
                            playText(
                              selectedLesson.dialogue
                                .map(([, line]) => line)
                                .join(" "),
                            )
                          }
                          className="inline-flex min-h-11 items-center gap-2 rounded-xl bg-[#0362C0] px-4 py-2 text-xs font-black text-white"
                        >
                          {isSpeaking ? (
                            <Pause className="h-4 w-4" />
                          ) : (
                            <Play className="h-4 w-4 fill-current" />
                          )}
                          Play dialog
                        </button>
                      </div>
                      <div className="mt-6 space-y-3">
                        {selectedLesson.dialogue.map(
                          ([speaker, line], index) => (
                            <div
                              key={`${speaker}-${index}`}
                              className={`flex ${index % 2 ? "justify-end" : "justify-start"
                                }`}
                            >
                              <div
                                className={`max-w-[88%] rounded-2xl p-4 ${index % 2
                                  ? "rounded-br-md bg-[#0362C0] text-white"
                                  : "rounded-bl-md bg-blue-50 text-slate-800"
                                  }`}
                              >
                                <div
                                  className={`text-[9px] font-black uppercase ${index % 2
                                    ? "text-blue-200"
                                    : "text-[#0362C0]"
                                    }`}
                                >
                                  {speaker}
                                </div>
                                <p className="mt-1 text-sm font-bold leading-6">
                                  {line}
                                </p>
                              </div>
                            </div>
                          ),
                        )}
                      </div>
                    </div>

                    <div className="rounded-[24px] bg-slate-950 p-5 text-white sm:p-7">
                      <Sparkles className="h-6 w-6 text-[#FFFF00]" />
                      <h3 className="mt-4 text-xl font-black">
                        Speaking Frames
                      </h3>
                      <p className="mt-2 text-xs leading-5 text-slate-400">
                        Ganti bagian kosong dengan informasi milikmu.
                      </p>
                      <div className="mt-5 space-y-3">
                        {selectedLesson.expressions.map((expression) => (
                          <button
                            type="button"
                            key={expression}
                            onClick={() =>
                              playText(expression.replace("___", "something"))
                            }
                            className="flex w-full items-center justify-between gap-3 rounded-xl bg-white/5 p-3 text-left text-sm font-bold transition hover:bg-white/10"
                          >
                            {expression}
                            <Volume2 className="h-4 w-4 shrink-0 text-[#87CEFA]" />
                          </button>
                        ))}
                      </div>
                    </div>
                  </div>
                )}

                {lessonTab === "practice" && (
                  <div className="grid gap-5 lg:grid-cols-[.85fr_1.15fr]">
                    <div className="rounded-[24px] bg-[#FFFF00] p-5 sm:p-7">
                      <div className="text-[10px] font-black uppercase tracking-[0.18em] text-[#0362C0]">
                        Your mission
                      </div>
                      <h3 className="mt-3 text-2xl font-black leading-tight">
                        {selectedLesson.mission}
                      </h3>
                      <div className="mt-6 space-y-3">
                        {selectedLesson.expressions.map((expression, index) => (
                          <div
                            key={expression}
                            className="rounded-xl bg-white/70 p-3 text-sm font-bold"
                          >
                            <span className="mr-2 text-[#0362C0]">
                              {index + 1}.
                            </span>
                            {expression}
                          </div>
                        ))}
                      </div>
                    </div>

                    <div className="rounded-[24px] bg-slate-950 p-5 text-center text-white sm:p-8">
                      <div
                        className={`mx-auto grid h-24 w-24 place-items-center rounded-full border-4 transition ${isRecording
                          ? "animate-pulse border-red-400 bg-red-500/20 text-red-400"
                          : "border-[#87CEFA]/30 bg-[#0362C0]/30 text-[#87CEFA]"
                          }`}
                      >
                        <Mic className="h-10 w-10" />
                      </div>
                      <h3 className="mt-5 text-2xl font-black">
                        {isRecording ? "Aku mendengarkan…" : "Saatnya bicara!"}
                      </h3>
                      <p className="mx-auto mt-2 max-w-md text-sm leading-6 text-slate-400">
                        Tekan mikrofon dan selesaikan misi. Tidak perlu
                        sempurna; fokus pada pesan yang jelas.
                      </p>
                      <button
                        type="button"
                        onClick={startRecording}
                        disabled={isRecording}
                        className="mt-6 inline-flex min-h-12 w-full items-center justify-center gap-2 rounded-2xl bg-[#FFFF00] px-6 py-3 text-sm font-black text-[#0362C0] disabled:cursor-wait disabled:opacity-70"
                      >
                        <Mic className="h-5 w-5" />
                        {isRecording ? "Mendengarkan…" : "Mulai Rekam Suara"}
                      </button>
                      {recordingResult && (
                        <div className="mt-4 rounded-2xl border border-white/10 bg-white/5 p-4 text-left text-sm leading-6 text-blue-100">
                          {recordingResult}
                        </div>
                      )}
                      <div className="mt-6 grid grid-cols-2 gap-2 sm:grid-cols-4">
                        {["Clarity", "Fluency", "Accuracy", "Confidence"].map(
                          (item) => (
                            <div
                              key={item}
                              className="rounded-xl bg-white/5 p-3 text-[10px] font-black uppercase text-slate-300"
                            >
                              {item}
                              <div className="mt-2 text-[#FFFF00]">
                                1 • 2 • 3
                              </div>
                            </div>
                          ),
                        )}
                      </div>
                    </div>
                  </div>
                )}

                {lessonTab === "quiz" && (
                  <div className="mx-auto max-w-2xl rounded-[26px] bg-slate-950 p-5 text-white shadow-2xl sm:p-8">
                    <div className="flex items-center justify-between gap-4">
                      <div>
                        <div className="text-[10px] font-black uppercase tracking-[0.18em] text-[#87CEFA]">
                          Quick measure
                        </div>
                        <h3 className="mt-2 text-2xl font-black">
                          Cek pemahamanmu.
                        </h3>
                      </div>
                      <div className="grid h-12 w-12 place-items-center rounded-2xl bg-[#FFFF00] text-[#0362C0]">
                        <HelpCircle className="h-6 w-6" />
                      </div>
                    </div>
                    <p className="mt-6 text-lg font-black leading-7">
                      {selectedLesson.quiz.question}
                    </p>
                    <div className="mt-5 space-y-3">
                      {selectedLesson.quiz.options.map((option, index) => {
                        const answered = quizChoice !== null;
                        const correct = index === selectedLesson.quiz.answer;
                        const selected = quizChoice === index;
                        return (
                          <button
                            type="button"
                            key={option}
                            disabled={answered}
                            onClick={() => setQuizChoice(index)}
                            className={`flex min-h-14 w-full items-center gap-3 rounded-2xl border-2 p-4 text-left text-sm font-bold transition ${answered && correct
                              ? "border-emerald-400 bg-emerald-500/15 text-emerald-100"
                              : answered && selected
                                ? "border-red-400 bg-red-500/15 text-red-100"
                                : "border-white/10 bg-white/5 text-slate-200 hover:border-[#87CEFA]"
                              }`}
                          >
                            <span className="grid h-8 w-8 shrink-0 place-items-center rounded-xl bg-white/10 text-xs font-black">
                              {String.fromCharCode(65 + index)}
                            </span>
                            {option}
                            {answered && correct && (
                              <CheckCircle2 className="ml-auto h-5 w-5 text-emerald-400" />
                            )}
                          </button>
                        );
                      })}
                    </div>
                    {quizChoice !== null && (
                      <div className="mt-5 rounded-2xl bg-white/5 p-4">
                        <div className="text-[10px] font-black uppercase text-[#FFFF00]">
                          Pembahasan
                        </div>
                        <p className="mt-1 text-sm leading-6 text-slate-300">
                          {selectedLesson.quiz.explanation}
                        </p>
                        <button
                          type="button"
                          onClick={() => setQuizChoice(null)}
                          className="mt-4 inline-flex items-center gap-2 text-xs font-black text-[#87CEFA]"
                        >
                          <RotateCcw className="h-4 w-4" />
                          Coba lagi
                        </button>
                      </div>
                    )}
                  </div>
                )}
              </div>
            </div>

            <div className="border-t border-slate-200 bg-white p-3 sm:px-6 sm:py-4">
              <div className="mx-auto flex max-w-4xl items-center justify-between gap-3">
                <div className="hidden text-xs font-bold text-slate-500 sm:block">
                  +{selectedLesson.xp} XP setelah menyelesaikan unit
                </div>
                <div className="flex w-full gap-2 sm:w-auto">
                  <button
                    type="button"
                    onClick={() => {
                      const currentIndex = sectionTabs.findIndex(
                        ([value]) => value === lessonTab,
                      );
                      if (currentIndex > 0) {
                        setLessonTab(sectionTabs[currentIndex - 1][0]);
                      }
                    }}
                    disabled={lessonTab === "overview"}
                    className="grid h-12 w-12 shrink-0 place-items-center rounded-xl border border-slate-200 text-slate-500 disabled:opacity-30"
                    aria-label="Bagian sebelumnya"
                  >
                    <ArrowLeft className="h-5 w-5" />
                  </button>
                  {lessonTab !== "quiz" ? (
                    <button
                      type="button"
                      onClick={() => {
                        const currentIndex = sectionTabs.findIndex(
                          ([value]) => value === lessonTab,
                        );
                        setLessonTab(sectionTabs[currentIndex + 1][0]);
                      }}
                      className="inline-flex min-h-12 flex-1 items-center justify-center gap-2 rounded-xl bg-[#0362C0] px-5 text-sm font-black text-white sm:flex-none"
                    >
                      Lanjut
                      <ChevronRight className="h-4 w-4" />
                    </button>
                  ) : (
                    <button
                      type="button"
                      onClick={finishLesson}
                      disabled={completedIds.includes(selectedLesson.id)}
                      className="inline-flex min-h-12 flex-1 items-center justify-center gap-2 rounded-xl bg-[#FFFF00] px-5 text-sm font-black text-[#0362C0] disabled:bg-emerald-100 disabled:text-emerald-700 sm:flex-none"
                    >
                      <Trophy className="h-4 w-4" />
                      {completedIds.includes(selectedLesson.id)
                        ? "Unit Selesai"
                        : "Selesaikan Unit"}
                    </button>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}