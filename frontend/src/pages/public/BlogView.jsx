import React, { useState, useMemo, useEffect } from "react";
import { 
  Search, 
  Calendar, 
  Clock, 
  BookOpen, 
  Heart, 
  X, 
  ArrowRight,
  TrendingUp,
  CheckCircle,
  Star,
  Plus,
  Trash2
} from "lucide-react";
import { useAuth } from "../../context/AuthContext";
import { blogService } from "../../services/api";

// Mock blog post data (fallback)
const DEFAULT_BLOG_POSTS = [
  {
    id: 1,
    title: "5 Tips Ampuh Mengatasi Rasa Takut & Canggung Saat Bicara Bahasa Inggris",
    excerpt: "Seringkali kendala utama belajar speaking bukan grammar, melainkan mental block. Simak cara melatih mental dan mengatasinya di sini.",
    category: "Tips & Trik",
    author: "Mr. Alfada Naufal",
    authorImage: "/alfa.png",
    date: "18 Agustus 2026",
    readTime: "5 Menit Baca",
    image: "/g.jpeg", // Using existing gallery image
    featured: true,
    likes: 42,
    commentsCount: 8,
    content: `
      <p class="lead text-lg font-semibold text-slate-700 mb-4">
        Apakah kamu sering merasa deg-degan, keringat dingin, atau mendadak 'blank' saat harus berbicara Bahasa Inggris di depan umum? Tenang, kamu tidak sendirian. Lebih dari 70% pembelajar bahasa asing mengalami apa yang disebut dengan <em>foreign language anxiety</em>.
      </p>
      
      <p class="mb-4">
        Masalah utama biasanya bukan karena kamu tidak tahu kosakata (vocabulary) atau rumus tata bahasa (grammar), tetapi karena adanya mental block berupa rasa takut dinilai salah, ditertawakan, atau kurang sempurna. Di artikel ini, kita akan membahas 5 tips praktis untuk meruntuhkan tembok ketakutan tersebut.
      </p>

      <h3 class="text-xl font-bold text-slate-900 mt-6 mb-3">1. Sadari Bahwa Komunikasi Lebih Penting daripada Kesempurnaan</h3>
      <p class="mb-4">
        Tujuan utama bahasa adalah untuk menyampaikan pesan (message delivery). Selama lawan bicara memahami maksudmu, komunikasi telah sukses dilakukan. Para penutur asli (native speakers) pun sangat memaklumi jika ada kesalahan tata bahasa kecil saat kamu berbicara. Mereka akan lebih menghargai usahamu dalam mengekspresikan diri.
      </p>

      <h3 class="text-xl font-bold text-slate-900 mt-6 mb-3">2. Mulai dari Berbicara dengan Diri Sendiri (Self-Talk)</h3>
      <p class="mb-4">
        Sebelum langsung terjun mengobrol dengan orang lain, biasakan mendeskripsikan aktivitas harianmu dalam Bahasa Inggris di dalam hati atau dengan suara pelan. Misalnya: "Now, I am making a cup of coffee. The weather is beautiful today." Teknik ini membantu membangun jembatan antara pikiran verbal dan otot motorik bicaramu.
      </p>

      <h3 class="text-xl font-bold text-slate-900 mt-6 mb-3">3. Lakukan Sesi Shadowing secara Konsisten</h3>
      <p class="mb-4">
        Shadowing adalah metode meniru ucapan pembicara asli (native speaker) sesegera mungkin saat mendengarnya. Ini melatih intonasi, ritme, dan pelafalan (pronunciation) secara tidak langsung tanpa membebani pikiranmu untuk menyusun kalimat baru. Cukup dengar, tiru, dan rasakan ritmenya.
      </p>

      <h3 class="text-xl font-bold text-slate-900 mt-6 mb-3">4. Temukan Partner yang Tepat dan Suportif</h3>
      <p class="mb-4">
        Belajar mandiri terkadang membosankan. Memiliki partner berlatih yang memiliki visi yang sama—atau didampingi oleh mentor profesional—akan mempercepat rasa percaya dirimu. Lingkungan yang bebas dari penghakiman (judgment-free zone) adalah kunci utama melatih kelancaran lidah.
      </p>

      <h3 class="text-xl font-bold text-slate-900 mt-6 mb-3">5. Jangan Takut untuk Bertanya atau Meminta Umpan Balik</h3>
      <p class="mb-4">
        Setiap kesalahan adalah langkah maju. Catat kata-kata yang sulit kamu ucapkan hari ini, lalu cari tahu pelafalan yang benar. Dengan melakukan evaluasi berkala, rasa canggung perlahan akan tergantikan oleh rasa percaya diri yang nyata.
      </p>
    `
  },
  {
    id: 2,
    title: "Mengenal Metode Shadowing: Cara Praktis Native Speaker Melatih Kelancaran",
    excerpt: "Bagaimana cara melatih otot lidah agar pelafalan terdengar natural? Shadowing adalah kunci utama yang banyak digunakan oleh poliglot dunia.",
    category: "Speaking Drill",
    author: "Ms. Deasy Puspawati",
    authorImage: "/deasy.png",
    date: "15 Agustus 2026",
    readTime: "4 Menit Baca",
    image: "/h.jpeg",
    featured: false,
    likes: 28,
    commentsCount: 3,
    content: `
      <p class="lead text-lg font-semibold text-slate-700 mb-4">
        Pernahkah kamu merasa lidahmu kaku saat melafalkan kata-kata Bahasa Inggris? Itu karena otot bicara kita belum terbiasa dengan artikulasi aksen asing. Salah satu metode terbaik untuk melatihnya adalah Shadowing.
      </p>

      <h3 class="text-xl font-bold text-slate-900 mt-6 mb-3">Apa itu Metode Shadowing?</h3>
      <p class="mb-4">
        Shadowing dikembangkan oleh Profesor Alexander Arguelles. Cara kerjanya sangat sederhana: kamu memutar klip audio (pidato, podcast, film) berbahasa Inggris, lalu menirukan suara tersebut secara real-time dengan jeda sekian milidetik, layaknya bayangan yang selalu mengikuti objeknya.
      </p>

      <h3 class="text-xl font-bold text-slate-900 mt-6 mb-3">Langkah Melakukan Shadowing untuk Pemula:</h3>
      <ul class="list-disc pl-6 mb-4 space-y-2">
        <li><strong>Pilih audio yang sesuai:</strong> Mulailah dengan tempo lambat dan durasi pendek (1-3 menit). Podcast edukasi atau dongeng anak sangat direkomendasikan.</li>
        <li><strong>Dengar tanpa teks pertama kali:</strong> Biasakan telinga menangkap bunyi, intonasi naik turun, serta penekanan suku kata.</li>
        <li><strong>Ulangi bersama teks:</strong> Bacakan teks mengikuti audio secara simultan. Ini melatih koneksi visual antara ejaan kata dan bunyinya.</li>
        <li><strong>Ulangi tanpa teks:</strong> Langkah terakhir ini adalah yang terpenting untuk melatih refleks motorik.</li>
      </ul>

      <p class="mb-4">
        Lakukan latihan ini selama 10-15 menit setiap hari. Konsistensi harian jauh lebih efektif daripada belajar 2 jam penuh hanya sekali dalam seminggu. Selamat mencoba!
      </p>
    `
  },
  {
    id: 3,
    title: "10 Frasa Slang Bahasa Inggris Populer yang Bikin Kamu Terdengar Lebih Natural",
    excerpt: "Ingin terdengar lebih santai dan tidak kaku layaknya textbook? Pelajari kumpulan idiom dan slang modern yang sering dipakai sehari-hari.",
    category: "Vocabulary",
    author: "Mr. Garry Wilson",
    authorImage: "/garry.png",
    date: "12 Agustus 2026",
    readTime: "6 Menit Baca",
    image: "/i.jpeg",
    featured: false,
    likes: 56,
    commentsCount: 12,
    content: `
      <p class="lead text-lg font-semibold text-slate-700 mb-4">
        Pernahkah kamu mengobrol dengan penutur asli dan bingung ketika mereka menggunakan kata-kata yang tidak ada di kamus sekolah? Itulah yang disebut dengan <em>slang</em> atau bahasa gaul.
      </p>

      <p class="mb-4">
        Menggunakan bahasa slang dalam situasi kasual akan membuat komunikasimu terdengar lebih hidup, luwes, dan akrab. Berikut adalah 10 slang populer tahun 2026 yang wajib kamu ketahui:
      </p>

      <div class="bg-slate-50 p-5 rounded-2xl border border-slate-200 space-y-3 mb-6">
        <p><strong>1. Spill the tea:</strong> Mengungkapkan gosip atau rahasia menarik. <em>(Example: "Come on, spill the tea!")</em></p>
        <p><strong>2. Slay:</strong> Melakukan sesuatu dengan sangat luar biasa sukses atau mengagumkan.</p>
        <p><strong>3. Vibe check:</strong> Memeriksa atau menilai energi/suasana sekitar atau seseorang.</p>
        <p><strong>4. For real:</strong> Menyatakan kesungguhan atau menyetujui sesuatu secara kuat.</p>
        <p><strong>5. Rent-free:</strong> Sesuatu yang terus memenuhi pikiranmu dan tidak bisa dilupakan.</p>
      </div>

      <p class="mb-4">
        Ingat, kunci dari penggunaan slang adalah menempatkannya pada konteks situasi yang tepat. Gunakan saat mengobrol dengan teman sebaya atau di komunitas santai, hindari menggunakannya pada sesi formal seperti wawancara kerja atau presentasi bisnis.
      </p>
    `
  },
  {
    id: 4,
    title: "Pentingnya Mengetahui Gaya Belajar Unik (ST30) Sebelum Belajar Speaking",
    excerpt: "Setiap orang punya karakter kognitif yang berbeda. Mengapa cara belajar speaking konvensional seringkali gagal? Temukan jawabannya di sini.",
    category: "Metode Belajar",
    author: "Tim Akademik",
    authorImage: "/MP.png",
    date: "10 Agustus 2026",
    readTime: "5 Menit Baca",
    image: "/j.jpeg",
    featured: false,
    likes: 31,
    commentsCount: 5,
    content: `
      <p class="lead text-lg font-semibold text-slate-700 mb-4">
        Mengapa ada siswa yang sangat cepat lancar bicara dengan sering mendengarkan lagu, sementara yang lain baru bisa lancar setelah banyak menulis dan melakukan simulasi roleplay? Jawabannya terletak pada gaya belajar unik masing-masing individu.
      </p>

      <p class="mb-4">
        Di Mahir Speaking, kami mengintegrasikan pendekatan 8 Cluster bakat alami (ST30) untuk mendeteksi cara kerja otakmu saat menyerap bahasa. Dengan mengetahui tipe karaktermu, kamu bisa menghemat waktu belajarmu secara drastif.
      </p>

      <h3 class="text-xl font-bold text-slate-900 mt-6 mb-3">Mengapa Metode Klasik Satu Ukuran (One-Size-Fits-All) Kurang Efektif?</h3>
      <p class="mb-4">
        Banyak bimbingan belajar memaksakan kurikulum hafalan yang kaku kepada semua tipe siswa. Padahal:
      </p>
      <ul class="list-disc pl-6 mb-4 space-y-2">
        <li><strong>Tipe Auditori:</strong> Lebih cepat menyerap melalui percakapan langsung, tanya-jawab spontan, dan diskusi kelompok.</li>
        <li><strong>Tipe Visual:</strong> Butuh visualisasi grafis, mindmapping kata, atau slide pendukung agar frasa melekat di memori.</li>
        <li><strong>Tipe Kinestetik:</strong> Perlu melakukan aksi fisik seperti bermain peran (roleplay), games interaktif, dan simulasi skenario nyata.</li>
      </ul>

      <p class="mb-4">
        Dengan menganalisis gaya belajarmu sejak awal lewat tes diagnostik, mentor kami bisa meramu teknik koreksi dan latihan speaking yang secara khusus memicu kenyamanan komunikasimu.
      </p>
    `
  }
];

const POPULAR_POSTS = [
  {
    id: 2,
    title: "Mengenal Metode Shadowing: Cara Praktis Melatih Kelancaran Bicara",
    date: "15 Agustus 2026",
    image: "/h.jpeg"
  },
  {
    id: 3,
    title: "10 Frasa Slang Bahasa Inggris Populer yang Sering Digunakan Sehari-hari",
    date: "12 Agustus 2026",
    image: "/i.jpeg"
  },
  {
    id: 4,
    title: "Pentingnya Mengidentifikasi Gaya Belajar Unik (ST30) Sebelum Kelas",
    date: "10 Agustus 2026",
    image: "/j.jpeg"
  }
];

const ALUMNI_TESTIMONIALS = [
  {
    name: "Rina Kusuma",
    text: "Dulu mau ngomong 'hello' aja mikir grammar 5 menit. Setelah ikut program intensif, sekarang pede banget ngomong sama klien luar negeri!",
    rating: 5
  },
  {
    name: "Andi Wijaya",
    text: "Sesi private dengan mentor bener-bener ngebantu karena dapet feedback pelafalan yang detail banget.",
    rating: 5
  }
];

export default function BlogView() {
  const { user } = useAuth();
  const [searchQuery, setSearchQuery] = useState("");
  
  // Persisted state of blog posts
  const [posts, setPosts] = useState(() => {
    const saved = localStorage.getItem("mahir_blog_posts");
    return saved ? JSON.parse(saved) : DEFAULT_BLOG_POSTS;
  });

  // Calculate Admin permission status
  const isAdmin = user && (user.role === 'admin' || user.email?.toLowerCase() === 'hartiniasri32@gmail.com' || user.admin_type);

  // Modals & Forms State
  const [selectedPost, setSelectedPost] = useState(null);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [likeCounts, setLikeCounts] = useState(() => {
    return posts.reduce((acc, post) => ({ ...acc, [post.id]: post.likes || 0 }), {});
  });
  const [likedPosts, setLikedPosts] = useState({});

  useEffect(() => {
    // Load likes from DB (or localStorage fallback)
    blogService.getLikes().then((res) => {
      if (res && res.success && Array.isArray(res.likes)) {
        const counts = {};
        res.likes.forEach((item) => {
          counts[item.post_id] = item.likes_count || 0;
        });
        setLikeCounts((prev) => ({ ...prev, ...counts }));
      }
    });

    // Load liked status
    const savedLiked = localStorage.getItem("mahir_blog_liked_posts");
    if (savedLiked) {
      try {
        setLikedPosts(JSON.parse(savedLiked));
      } catch (e) {}
    }
  }, []);

  // Add Article Form States
  const [newTitle, setNewTitle] = useState("");
  const [newExcerpt, setNewExcerpt] = useState("");
  const [newCategory, setNewCategory] = useState("Tips & Trik");
  const [newReadTime, setNewReadTime] = useState("5 Menit Baca");
  const [newContent, setNewContent] = useState("");
  const [newImage, setNewImage] = useState("/g.jpeg");
  const [newFeatured, setNewFeatured] = useState(false);

  // Registration Form State (Emerald/Green Card in Sidebar)
  const [registrationName, setRegistrationName] = useState("");
  const [registrationPhone, setRegistrationPhone] = useState("");
  const [formSubmitted, setFormSubmitted] = useState(false);

  // Filter posts based on search query
  const filteredPosts = useMemo(() => {
    return posts.filter((post) => {
      return (
        post.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        post.excerpt.toLowerCase().includes(searchQuery.toLowerCase()) ||
        post.category.toLowerCase().includes(searchQuery.toLowerCase())
      );
    });
  }, [posts, searchQuery]);

  // Find the featured post (only from filtered list or fallback to first one)
  const featuredPost = useMemo(() => {
    const featured = filteredPosts.find((post) => post.featured);
    return featured || filteredPosts[0];
  }, [filteredPosts]);

  // Regular grid posts (excluding the featured one)
  const gridPosts = useMemo(() => {
    if (!featuredPost) return [];
    return filteredPosts.filter((post) => post.id !== featuredPost.id);
  }, [filteredPosts, featuredPost]);

  const handleLike = async (postId, e) => {
    e.stopPropagation();
    const isLiked = likedPosts[postId];
    const action = isLiked ? 'unlike' : 'like';

    const newLiked = { ...likedPosts, [postId]: !isLiked };
    setLikedPosts(newLiked);
    localStorage.setItem("mahir_blog_liked_posts", JSON.stringify(newLiked));

    const res = await blogService.likePost(postId, action);
    if (res && res.success && res.likes_count !== undefined) {
      setLikeCounts((prev) => ({ ...prev, [postId]: res.likes_count }));
      setPosts((prevPosts) => {
        const updated = prevPosts.map((p) => {
          if (p.id === postId) {
            return { ...p, likes: res.likes_count };
          }
          return p;
        });
        localStorage.setItem("mahir_blog_posts", JSON.stringify(updated));
        return updated;
      });
    }
  };

  const handleFormSubmit = (e) => {
    e.preventDefault();
    if (registrationName.trim() && registrationPhone.trim()) {
      setFormSubmitted(true);
      setTimeout(() => {
        setRegistrationName("");
        setRegistrationPhone("");
        setFormSubmitted(false);
      }, 4000);
    }
  };

  // Create article action
  const handleCreatePost = (e) => {
    e.preventDefault();
    const newPostId = posts.length > 0 ? Math.max(...posts.map(p => p.id)) + 1 : 1;
    const createdPost = {
      id: newPostId,
      title: newTitle,
      excerpt: newExcerpt,
      category: newCategory,
      author: user ? user.full_name : "Administrator",
      authorImage: user && user.avatar ? user.avatar : "/MP.png",
      date: new Date().toLocaleDateString("id-ID", {
        day: "numeric",
        month: "long",
        year: "numeric"
      }),
      readTime: newReadTime,
      image: newImage,
      featured: newFeatured,
      likes: 0,
      commentsCount: 0,
      content: `<p class="lead text-lg font-semibold text-slate-700 mb-4">${newExcerpt}</p>
                <p class="mb-4">${newContent.replace(/\n/g, "</p><p class='mb-4'>")}</p>`
    };

    let updatedPosts = [...posts];
    if (newFeatured) {
      // Unfeature other posts if this one is set as featured
      updatedPosts = updatedPosts.map(p => ({ ...p, featured: false }));
    }
    updatedPosts = [createdPost, ...updatedPosts];

    setPosts(updatedPosts);
    localStorage.setItem("mahir_blog_posts", JSON.stringify(updatedPosts));

    // Reset Form
    setNewTitle("");
    setNewExcerpt("");
    setNewContent("");
    setNewCategory("Tips & Trik");
    setNewReadTime("5 Menit Baca");
    setNewImage("/g.jpeg");
    setNewFeatured(false);
    setIsAddModalOpen(false);
  };

  // Delete article action
  const handleDeletePost = (postId, e) => {
    e.stopPropagation();
    if (window.confirm("Apakah Anda yakin ingin menghapus artikel ini?")) {
      const updatedPosts = posts.filter(p => p.id !== postId);
      setPosts(updatedPosts);
      localStorage.setItem("mahir_blog_posts", JSON.stringify(updatedPosts));
      
      // Close reader modal if the deleted post was open
      if (selectedPost && selectedPost.id === postId) {
        setSelectedPost(null);
      }
    }
  };

  return (
    <main className="min-h-screen bg-slate-50 text-slate-800 pb-20">
      
      {/* 🚀 HERO SECTION */}
      <section className="relative overflow-hidden bg-gradient-to-r from-blue-900 via-indigo-900 to-slate-900 text-white py-16 px-4 sm:px-6 lg:px-8">
        <div className="absolute top-0 right-1/4 w-96 h-96 bg-purple-500/10 rounded-full blur-3xl pointer-events-none"></div>
        <div className="absolute bottom-0 left-1/4 w-96 h-96 bg-cyan-500/10 rounded-full blur-3xl pointer-events-none"></div>
        
        <div className="relative max-w-6xl mx-auto text-center space-y-6">
          <h1 className="font-stinger font-black text-3xl sm:text-5xl lg:text-6xl text-white tracking-tight leading-tight">
            Edukasi & <span className="text-cyan-400">Tips Lancar Bicara</span>
          </h1>
          
          <p className="max-w-2xl mx-auto text-slate-300 text-sm sm:text-base font-semibold leading-relaxed">
            Dapatkan insight eksklusif, tutorial pelafalan, tips mental percaya diri, serta kisah inspirasi belajar langsung dari para mentor terbaik kami.
          </p>

          {/* Search bar & Admin Control */}
          <div className="max-w-md mx-auto relative pt-4 space-y-4">
            <div className="relative">
              <Search className="absolute left-4 top-3.5 w-5 h-5 text-slate-400" />
              <input
                type="text"
                placeholder="Cari artikel, tips, slang..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full bg-white/10 border border-white/20 hover:border-white/40 focus:border-cyan-400 focus:bg-white text-slate-900 focus:text-slate-900 placeholder-slate-400 focus:placeholder-slate-500 px-12 py-3.5 rounded-2xl outline-none transition-all text-sm font-semibold shadow-inner"
              />
            </div>
            
            {/* Admin Add Article Button */}
            {isAdmin && (
              <div className="flex justify-center pt-2">
                <button
                  onClick={() => setIsAddModalOpen(true)}
                  className="inline-flex items-center gap-2 bg-cyan-400 text-slate-950 font-black text-xs px-5 py-3 rounded-2xl hover:bg-cyan-300 hover:scale-102 transition-all shadow-lg border-2 border-white/10"
                >
                  <Plus className="w-4.5 h-4.5 stroke-[3]" />
                  <span>TULIS ARTIKEL BARU</span>
                </button>
              </div>
            )}
          </div>
        </div>
      </section>

      {/* 📰 MAIN GRID LAYOUT: LEFT CONTENT & RIGHT SIDEBAR */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-12">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          
          {/* 📝 LEFT COLUMN: Main Blog Articles (col-span-8) */}
          <div className="lg:col-span-8 space-y-10">
            {filteredPosts.length === 0 ? (
              <div className="text-center py-20 bg-white rounded-3xl border border-slate-200 shadow-sm p-8">
                <p className="text-slate-400 text-lg font-bold">Tidak ada artikel yang cocok dengan pencarian Anda.</p>
                <button 
                  onClick={() => setSearchQuery("")}
                  className="mt-4 px-5 py-2 rounded-xl bg-[#7457E8] text-white text-xs font-bold"
                >
                  Reset Pencarian
                </button>
              </div>
            ) : (
              <div className="space-y-10">
                
                {/* Featured Post Card */}
                {featuredPost && (
                  <div 
                    onClick={() => setSelectedPost(featuredPost)}
                    className="group bg-white border border-slate-200 rounded-3xl overflow-hidden shadow-sm hover:shadow-popout hover:border-[#7457E8]/40 transition-all duration-300 cursor-pointer grid grid-cols-1 md:grid-cols-12 gap-0 relative"
                  >
                    {/* Admin Delete Action */}
                    {isAdmin && (
                      <button
                        onClick={(e) => handleDeletePost(featuredPost.id, e)}
                        className="absolute top-4 right-4 bg-red-600 hover:bg-red-700 text-white rounded-full p-2.5 z-10 transition-transform active:scale-95 shadow-md flex items-center justify-center border border-red-500/30"
                        title="Hapus Artikel"
                      >
                        <Trash2 className="w-4.5 h-4.5" />
                      </button>
                    )}

                    <div className="md:col-span-7 h-64 sm:h-80 md:h-full relative overflow-hidden">
                      <img
                        src={featuredPost.image}
                        alt={featuredPost.title}
                        className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-102"
                      />
                      <div className="absolute left-4 top-4 bg-purple-600 text-white text-[10px] font-black uppercase px-3.5 py-1.5 rounded-full shadow-md">
                        Artikel Utama
                      </div>
                    </div>
                    
                    <div className="md:col-span-5 p-6 sm:p-8 flex flex-col justify-between space-y-6">
                      <div className="space-y-4">
                        <span className="inline-block bg-[#EAF6FF] text-[#0362C0] text-[10px] font-black px-3 py-1 rounded-full uppercase tracking-wider">
                          {featuredPost.category}
                        </span>
                        <h2 className="text-lg sm:text-xl font-black text-slate-900 group-hover:text-[#7457E8] transition-colors leading-tight">
                          {featuredPost.title}
                        </h2>
                        <p className="text-slate-500 text-xs font-semibold leading-relaxed line-clamp-4">
                          {featuredPost.excerpt}
                        </p>
                      </div>
                      
                      <div className="flex items-center justify-between pt-4 border-t border-slate-100">
                        <div className="flex items-center gap-3">
                          <img
                            src={featuredPost.authorImage}
                            alt={featuredPost.author}
                            className="w-10 h-10 rounded-full object-cover border-2 border-[#7457E8]/20 bg-purple-100"
                          />
                          <div>
                            <h4 className="text-xs font-black text-slate-900">{featuredPost.author}</h4>
                            <span className="text-[10px] text-slate-400 font-bold">{featuredPost.date}</span>
                          </div>
                        </div>
                        
                        <div className="flex items-center gap-1 text-slate-400 font-bold text-xs">
                          <Clock className="w-4 h-4" />
                          <span>{featuredPost.readTime}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                {/* Grid List of Other Articles */}
                {gridPosts.length > 0 && (
                  <div className="space-y-6">
                    <div className="flex items-center gap-2 border-b border-slate-200 pb-3">
                      <TrendingUp className="w-5 h-5 text-[#7457E8]" />
                      <h3 className="text-sm font-black uppercase text-slate-900 tracking-wider">Artikel Terbaru</h3>
                    </div>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      {gridPosts.map((post) => (
                        <article
                          key={post.id}
                          onClick={() => setSelectedPost(post)}
                          className="group bg-white border border-slate-200 rounded-3xl overflow-hidden shadow-sm hover:shadow-popout hover:border-[#7457E8]/30 transition-all duration-300 cursor-pointer flex flex-col justify-between relative"
                        >
                          {/* Admin Delete Action */}
                          {isAdmin && (
                            <button
                              onClick={(e) => handleDeletePost(post.id, e)}
                              className="absolute top-4 left-4 bg-red-600 hover:bg-red-700 text-white rounded-full p-2 z-10 transition-transform active:scale-95 shadow-md flex items-center justify-center border border-red-500/30"
                              title="Hapus Artikel"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          )}

                          <div className="relative h-44 overflow-hidden">
                            <img
                              src={post.image}
                              alt={post.title}
                              className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-103"
                            />
                            <div className="absolute right-4 top-4 bg-white/90 backdrop-blur-sm text-slate-900 text-[10px] font-black uppercase px-3 py-1 rounded-full shadow-sm">
                              {post.category}
                            </div>
                          </div>
                          
                          <div className="p-5 flex-1 flex flex-col justify-between space-y-4">
                            <div className="space-y-2">
                              <h4 className="text-sm font-black text-slate-900 group-hover:text-[#7457E8] transition-colors line-clamp-2 leading-snug">
                                {post.title}
                              </h4>
                              <p className="text-slate-500 text-xs font-semibold line-clamp-3 leading-relaxed">
                                {post.excerpt}
                              </p>
                            </div>
                            
                            <div className="flex items-center justify-between pt-4 border-t border-slate-100">
                              <div className="flex items-center gap-2.5">
                                <img
                                  src={post.authorImage}
                                  alt={post.author}
                                  className="w-7 h-7 rounded-full object-cover border border-[#7457E8]/20 bg-purple-50"
                                />
                                <div>
                                  <h5 className="text-[10px] font-black text-slate-900">{post.author}</h5>
                                  <span className="text-[9px] text-slate-400 font-bold">{post.date}</span>
                                </div>
                              </div>
                              
                              <div className="flex items-center gap-2">
                                <button
                                  onClick={(e) => handleLike(post.id, e)}
                                  className={`flex items-center gap-1 text-[11px] font-black ${
                                    likedPosts[post.id] ? "text-red-500" : "text-slate-400 hover:text-red-500"
                                  }`}
                                >
                                  <Heart className={`w-3 h-3 ${likedPosts[post.id] ? "fill-current" : ""}`} />
                                  <span>{likeCounts[post.id] || 0}</span>
                                </button>
                              </div>
                            </div>
                          </div>
                        </article>
                      ))}
                    </div>
                  </div>
                )}
                
              </div>
            )}
          </div>
          
          {/* 📋 RIGHT COLUMN: SIDEBAR (col-span-4) - Matches layout schematic */}
          <div className="lg:col-span-4 space-y-8">
            
            {/* Sidebar Card 1: Emerald/Green Registration Box (Featured card in schematic) */}
            <div className="bg-gradient-to-br from-emerald-500 to-teal-600 text-white rounded-3xl p-6 shadow-md border-2 border-emerald-400 space-y-4 relative overflow-hidden group">
              <div className="absolute top-0 right-0 w-24 h-24 bg-white/10 rounded-bl-full pointer-events-none"></div>
              
              <div className="space-y-2">
                <span className="bg-white/20 text-white text-[10px] font-black px-2.5 py-1 rounded-full uppercase tracking-wider inline-block">
                  GRATIS & TERBATAS
                </span>
                <h3 className="text-lg font-black leading-tight text-white">Konsultasi Belajar & Tes Speaking</h3>
                <p className="text-xs text-emerald-50 font-semibold leading-relaxed">
                  Tinggalkan kontak Anda. Tim akademik kami akan menganalisis level Bahasa Inggris serta karakter belajar unik Anda secara gratis.
                </p>
              </div>

              {formSubmitted ? (
                <div className="bg-white/15 border border-white/25 rounded-2xl p-4 text-center space-y-2 py-6 animate-pulse">
                  <CheckCircle className="w-8 h-8 text-white mx-auto" />
                  <h4 className="text-xs font-black">Permintaan Terkirim!</h4>
                  <p className="text-[10px] text-emerald-100">Tim kami akan segera menghubungi WhatsApp Anda.</p>
                </div>
              ) : (
                <form onSubmit={handleFormSubmit} className="space-y-2.5 pt-2">
                  <input
                    type="text"
                    required
                    placeholder="Nama Lengkap Anda"
                    value={registrationName}
                    onChange={(e) => setRegistrationName(e.target.value)}
                    className="w-full bg-white text-slate-800 placeholder-slate-400 px-4 py-2.5 rounded-xl outline-none text-xs font-bold border border-emerald-400/30 focus:border-white"
                  />
                  <input
                    type="tel"
                    required
                    placeholder="No. WhatsApp Anda (e.g. 0812...)"
                    value={registrationPhone}
                    onChange={(e) => setRegistrationPhone(e.target.value)}
                    className="w-full bg-white text-slate-800 placeholder-slate-400 px-4 py-2.5 rounded-xl outline-none text-xs font-bold border border-emerald-400/30 focus:border-white"
                  />
                  <button
                    type="submit"
                    className="w-full py-2.5 bg-yellow-300 hover:bg-yellow-400 text-slate-950 font-black text-xs rounded-xl shadow-md transition-transform active:scale-98 flex items-center justify-center gap-1.5"
                  >
                    <span>Hubungi Saya</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                </form>
              )}
            </div>

            {/* Sidebar Card 2: Popular Articles */}
            <div className="bg-white border border-slate-200 rounded-3xl p-5 shadow-sm space-y-4">
              <h3 className="text-xs font-black text-slate-900 uppercase tracking-widest border-b border-slate-100 pb-2">
                Artikel Populer
              </h3>
              
              <div className="space-y-4">
                {POPULAR_POSTS.map((post) => (
                  <div
                    key={post.id}
                    onClick={() => {
                      const found = posts.find(p => p.id === post.id);
                      if (found) setSelectedPost(found);
                    }}
                    className="flex gap-3.5 items-center group cursor-pointer"
                  >
                    <img
                      src={post.image}
                      alt={post.title}
                      className="w-14 h-14 rounded-2xl object-cover border border-slate-200 flex-shrink-0 group-hover:scale-102 transition-transform"
                    />
                    <div className="space-y-1">
                      <h4 className="text-xs font-black text-slate-900 group-hover:text-[#7457E8] transition-colors leading-snug line-clamp-2">
                        {post.title}
                      </h4>
                      <span className="text-[10px] text-slate-400 font-bold flex items-center gap-1">
                        <Calendar className="w-3 h-3" />
                        {post.date}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Sidebar Card 3: Alumni Testimonials (Cerita Sukses) */}
            <div className="bg-white border border-slate-200 rounded-3xl p-5 shadow-sm space-y-4">
              <h3 className="text-xs font-black text-slate-900 uppercase tracking-widest border-b border-slate-100 pb-2">
                Cerita Alumni
              </h3>
              
              <div className="space-y-4">
                {ALUMNI_TESTIMONIALS.map((testi, idx) => (
                  <div key={idx} className="space-y-2 border-b border-slate-100 last:border-b-0 pb-3 last:pb-0">
                    <div className="flex items-center gap-1">
                      {[...Array(testi.rating)].map((_, rIdx) => (
                        <Star key={rIdx} className="w-3 h-3 text-yellow-400 fill-current" />
                      ))}
                    </div>
                    <p className="text-[11px] text-slate-600 font-medium leading-relaxed italic">
                      "{testi.text}"
                    </p>
                    <h5 className="text-[10px] font-black text-slate-900">- {testi.name}</h5>
                  </div>
                ))}
              </div>
            </div>

          </div>
          
        </div>
      </section>

      {/* 📖 ARTICLE READER MODAL */}
      {selectedPost && (
        <div
          className="fixed inset-0 z-[100] flex justify-center items-start bg-slate-950/80 p-4 backdrop-blur-md overflow-y-auto py-8 sm:py-12 custom-scrollbar"
          onClick={() => setSelectedPost(null)}
        >
          <div
            className="relative w-full max-w-3xl overflow-hidden rounded-[28px] bg-white shadow-2xl my-8 cursor-default flex flex-col"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Header image & close button */}
            <div className="relative h-64 sm:h-80 w-full overflow-hidden">
              <img
                src={selectedPost.image}
                alt={selectedPost.title}
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent"></div>
              
              <button
                onClick={() => setSelectedPost(null)}
                className="absolute right-4 top-4 bg-black/50 hover:bg-black/70 text-white rounded-full p-2.5 transition-colors z-20"
                aria-label="Tutup Artikel"
              >
                <X className="w-5 h-5" />
              </button>

              <div className="absolute bottom-6 left-6 right-6 text-white space-y-2">
                <span className="bg-[#7457E8] text-white text-[10px] font-black uppercase px-3.5 py-1.5 rounded-full inline-block">
                  {selectedPost.category}
                </span>
                <h2 className="text-xl sm:text-2xl lg:text-3xl font-black leading-tight drop-shadow-md">
                  {selectedPost.title}
                </h2>
              </div>
            </div>

            {/* Author meta bar */}
            <div className="bg-slate-50 border-b border-slate-200 px-6 py-4 flex flex-wrap items-center justify-between gap-4">
              <div className="flex items-center gap-3">
                <img
                  src={selectedPost.authorImage}
                  alt={selectedPost.author}
                  className="w-10 h-10 rounded-full object-cover border border-purple-300 bg-purple-50"
                />
                <div>
                  <h4 className="text-xs font-black text-slate-900">{selectedPost.author}</h4>
                  <span className="text-[10px] text-slate-400 font-bold">Diterbitkan pada {selectedPost.date}</span>
                </div>
              </div>
              
              <div className="flex items-center gap-4 text-xs font-bold text-slate-500">
                <span className="flex items-center gap-1 text-slate-400"><Clock className="w-4 h-4" />{selectedPost.readTime}</span>
                <button
                  onClick={(e) => handleLike(selectedPost.id, e)}
                  className={`flex items-center gap-1.5 font-black text-sm transition-transform active:scale-95 ${
                    likedPosts[selectedPost.id] ? "text-red-500" : "text-slate-400 hover:text-red-500"
                  }`}
                >
                  <Heart className={`w-4 h-4 ${likedPosts[selectedPost.id] ? "fill-current" : ""}`} />
                  <span>{likeCounts[selectedPost.id] || 0} Suka</span>
                </button>
              </div>
            </div>

            {/* Article Content */}
            <article 
              className="p-6 sm:p-8 prose prose-slate max-w-none text-slate-700 font-medium leading-relaxed"
              dangerouslySetInnerHTML={{ __html: selectedPost.content }}
            />
          </div>
        </div>
      )}

      {/* ✍️ WRITE ARTICLE MODAL (Admin Portal Popup) */}
      {isAddModalOpen && (
        <div 
          className="fixed inset-0 z-[110] bg-slate-950/80 p-4 backdrop-blur-md overflow-y-auto flex justify-center items-start py-8 sm:py-12 custom-scrollbar"
          onClick={() => setIsAddModalOpen(false)}
        >
          <div 
            className="w-full max-w-2xl bg-white rounded-3xl shadow-2xl overflow-hidden flex flex-col my-8 cursor-default"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Modal Header */}
            <div className="bg-gradient-to-r from-blue-900 to-indigo-900 text-white px-6 py-4 flex items-center justify-between">
              <h3 className="font-stinger font-black text-lg sm:text-xl tracking-wide flex items-center gap-2">
                <Plus className="w-5 h-5 text-cyan-400 stroke-[3]" />
                <span>Tulis Artikel Blog Baru</span>
              </h3>
              <button 
                onClick={() => setIsAddModalOpen(false)}
                className="text-white/80 hover:text-white bg-white/10 hover:bg-white/20 p-1.5 rounded-full transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Modal Form Content */}
            <form onSubmit={handleCreatePost} className="p-6 space-y-4 overflow-y-auto max-h-[70vh] text-xs sm:text-sm">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* Title */}
                <div className="space-y-1.5 md:col-span-2">
                  <label className="font-black text-slate-700 uppercase tracking-wider text-[10px]">Judul Artikel *</label>
                  <input
                    type="text"
                    required
                    placeholder="Masukkan judul artikel yang menarik..."
                    value={newTitle}
                    onChange={(e) => setNewTitle(e.target.value)}
                    className="w-full px-4 py-3 rounded-xl border border-slate-200 outline-none focus:border-[#7457E8] font-semibold text-slate-800 bg-slate-50 focus:bg-white transition-all"
                  />
                </div>

                {/* Excerpt */}
                <div className="space-y-1.5 md:col-span-2">
                  <label className="font-black text-slate-700 uppercase tracking-wider text-[10px]">Ringkasan Pendek (Excerpt) *</label>
                  <textarea
                    required
                    rows="2"
                    placeholder="Ringkasan singkat yang muncul di kartu artikel..."
                    value={newExcerpt}
                    onChange={(e) => setNewExcerpt(e.target.value)}
                    className="w-full px-4 py-3 rounded-xl border border-slate-200 outline-none focus:border-[#7457E8] font-semibold text-slate-800 bg-slate-50 focus:bg-white transition-all resize-none"
                  />
                </div>

                {/* Category */}
                <div className="space-y-1.5">
                  <label className="font-black text-slate-700 uppercase tracking-wider text-[10px]">Kategori *</label>
                  <select
                    value={newCategory}
                    onChange={(e) => setNewCategory(e.target.value)}
                    className="w-full px-4 py-3 rounded-xl border border-slate-200 outline-none focus:border-[#7457E8] font-bold text-slate-800 bg-slate-50 focus:bg-white transition-all"
                  >
                    <option value="Tips & Trik">Tips & Trik</option>
                    <option value="Speaking Drill">Speaking Drill</option>
                    <option value="Vocabulary">Vocabulary</option>
                    <option value="Metode Belajar">Metode Belajar</option>
                    <option value="Umum">Umum</option>
                  </select>
                </div>

                {/* Read Time */}
                <div className="space-y-1.5">
                  <label className="font-black text-slate-700 uppercase tracking-wider text-[10px]">Estimasi Waktu Baca *</label>
                  <input
                    type="text"
                    required
                    value={newReadTime}
                    onChange={(e) => setNewReadTime(e.target.value)}
                    className="w-full px-4 py-3 rounded-xl border border-slate-200 outline-none focus:border-[#7457E8] font-semibold text-slate-800 bg-slate-50 focus:bg-white transition-all"
                  />
                </div>

                {/* Cover Image Selector */}
                <div className="space-y-1.5">
                  <label className="font-black text-slate-700 uppercase tracking-wider text-[10px]">Foto Cover Artikel *</label>
                  <select
                    value={newImage}
                    onChange={(e) => setNewImage(e.target.value)}
                    className="w-full px-4 py-3 rounded-xl border border-slate-200 outline-none focus:border-[#7457E8] font-bold text-slate-800 bg-slate-50 focus:bg-white transition-all"
                  >
                    <option value="/g.jpeg">Gallery G (Belajar Sesi Individu)</option>
                    <option value="/h.jpeg">Gallery H (Diskusi Kelompok)</option>
                    <option value="/i.jpeg">Gallery I (Speaking Club)</option>
                    <option value="/j.jpeg">Gallery J (Workshop Professional)</option>
                    <option value="/k.jpeg">Gallery K (Evaluasi Pelafalan)</option>
                    <option value="/l.jpeg">Gallery L (Perayaan Progres)</option>
                    <option value="/m.jpg">Community Event M</option>
                    <option value="/n.jpg">Global Connection N</option>
                    <option value="/o.jpg">Flexible Study O</option>
                  </select>
                </div>

                {/* Is Featured Checkbox */}
                <div className="flex items-center gap-3.5 pt-6 pl-2">
                  <input
                    type="checkbox"
                    id="featured"
                    checked={newFeatured}
                    onChange={(e) => setNewFeatured(e.target.checked)}
                    className="w-5 h-5 rounded text-[#7457E8] border-slate-300 focus:ring-[#7457E8] cursor-pointer"
                  />
                  <label htmlFor="featured" className="font-black text-slate-700 uppercase tracking-wider text-[10px] cursor-pointer">
                    Jadikan Artikel Utama (Featured)
                  </label>
                </div>

                {/* Article Content Body */}
                <div className="space-y-1.5 md:col-span-2">
                  <label className="font-black text-slate-700 uppercase tracking-wider text-[10px]">Isi Konten Artikel *</label>
                  <textarea
                    required
                    rows="6"
                    placeholder="Tulis materi, isi tips, atau bahasan artikel Anda di sini..."
                    value={newContent}
                    onChange={(e) => setNewContent(e.target.value)}
                    className="w-full px-4 py-3 rounded-xl border border-slate-200 outline-none focus:border-[#7457E8] font-semibold text-slate-800 bg-slate-50 focus:bg-white transition-all"
                  />
                </div>
              </div>

              {/* Form Buttons */}
              <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setIsAddModalOpen(false)}
                  className="px-5 py-2.5 rounded-xl border border-slate-200 hover:bg-slate-50 text-slate-600 font-bold text-xs transition-colors"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  className="px-6 py-2.5 bg-cyan-400 hover:bg-cyan-300 text-slate-950 font-black text-xs rounded-xl shadow-md transition-all active:scale-98"
                >
                  Terbitkan Artikel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </main>
  );
}
