const Questions = [
  {
    question:
      "Bagaimana kamu menghadapi proyek besar atau tugas penting di pekerjaan?",
    options: [
      {
        text: "Menyusun visi besar, membagi peran, dan memimpin tim.",
        type: "SOLARIETH",
      },
      {
        text: "Analisa detail dan data sebelum mulai bergerak.",
        type: "VARNETH",
      },
      { text: "Cari ide kreatif dan solusi out-of-the-box.", type: "AERYTH" },
      { text: "Ajak diskusi tim dan fokus ke kolaborasi.", type: "NIVARETH" },
      {
        text: "Ambil keputusan cepat dan langsung eksekusi.",
        type: "LUNARETH",
      },
      { text: "Ikuti prosedur, kerja stabil sampai selesai.", type: "THARITH" },
      { text: "Fleksibel, menyesuaikan dengan perubahan.", type: "ELARITH" },
      { text: "Pastikan sesuai aturan dan transparan.", type: "ZERYTH" },
    ],
  },
  {
    question:
      "Saat harus mengambil keputusan sulit, apa yang biasanya kamu pertimbangkan?",
    options: [
      {
        text: "Dampaknya terhadap visi besar dan kepemimpinan.",
        type: "SOLARIETH",
      },
      { text: "Logika, data, dan fakta yang ada.", type: "VARNETH" },
      { text: "Kemungkinan ide baru atau peluang kreatif.", type: "AERYTH" },
      { text: "Pendapat dan perasaan orang lain.", type: "NIVARETH" },
      { text: "Efisiensi dan kecepatan penyelesaian.", type: "LUNARETH" },
      { text: "Keamanan, kestabilan, dan prosedur.", type: "THARITH" },
      { text: "Apakah ini jadi tantangan menarik buatku.", type: "ELARITH" },
      { text: "Nilai moral dan etika yang benar.", type: "ZERYTH" },
    ],
  },
  {
    question:
      "Bagaimana cara kamu mengatur prioritas antara beberapa tugas sekaligus?",
    options: [
      {
        text: "Membuat strategi jangka panjang dan delegasi.",
        type: "SOLARIETH",
      },
      {
        text: "Menganalisa detail lalu menyusun urutan logis.",
        type: "VARNETH",
      },
      {
        text: "Memilih yang paling menarik atau kreatif dulu.",
        type: "AERYTH",
      },
      {
        text: "Mendiskusikan dengan orang lain untuk cari kesepakatan.",
        type: "NIVARETH",
      },
      {
        text: "Fokus pada hasil cepat dan langsung eksekusi.",
        type: "LUNARETH",
      },
      { text: "Mengerjakan sesuai prosedur satu per satu.", type: "THARITH" },
      { text: "Menyesuaikan dengan perubahan situasi.", type: "ELARITH" },
      { text: "Memilih yang paling benar secara moral.", type: "ZERYTH" },
    ],
  },
  {
    question:
      "Bagaimana tipe lingkungan kerja yang membuatmu paling produktif?",
    options: [
      {
        text: "Lingkungan yang kompetitif dan penuh tantangan.",
        type: "SOLARIETH",
      },
      { text: "Tempat yang teratur, tenang, dan penuh data.", type: "VARNETH" },
      { text: "Ruang kreatif dengan banyak kebebasan ide.", type: "AERYTH" },
      { text: "Lingkungan kolaboratif dengan tim suportif.", type: "NIVARETH" },
      {
        text: "Tempat yang memberi kebebasan ambil keputusan.",
        type: "LUNARETH",
      },
      { text: "Lingkungan stabil, rapi, dan terstruktur.", type: "THARITH" },
      { text: "Situasi dinamis yang penuh tantangan baru.", type: "ELARITH" },
      {
        text: "Tempat yang menjunjung integritas dan kejujuran.",
        type: "ZERYTH",
      },
    ],
  },
  {
    question: "Bagaimana kamu merencanakan dan menjalani hari-hari rutin?",
    options: [
      {
        text: "Dengan target ambisius dan strategi terukur.",
        type: "SOLARIETH",
      },
      {
        text: "Dengan checklist detail dan analisa prioritas.",
        type: "VARNETH",
      },
      {
        text: "Dengan spontanitas, biar ada hal baru tiap hari.",
        type: "AERYTH",
      },
      {
        text: "Dengan fleksibel, menyesuaikan kebutuhan orang sekitar.",
        type: "NIVARETH",
      },
      {
        text: "Dengan langsung bergerak cepat ke hal penting.",
        type: "LUNARETH",
      },
      { text: "Dengan jadwal teratur dan disiplin.", type: "THARITH" },
      { text: "Dengan flow bebas, siap adaptasi kapan saja.", type: "ELARITH" },
      { text: "Dengan aturan moral yang jadi pegangan.", type: "ZERYTH" },
    ],
  },
  {
    question:
      "Apa yang biasanya kamu lakukan saat menghadapi gangguan atau perubahan mendadak?",
    options: [
      { text: "Tetap memimpin, mengarahkan orang lain.", type: "SOLARIETH" },
      { text: "Analisa situasi baru dengan hati-hati.", type: "VARNETH" },
      { text: "Cari cara kreatif agar tetap jalan.", type: "AERYTH" },
      { text: "Mencari masukan dari orang sekitar.", type: "NIVARETH" },
      { text: "Segera ambil keputusan cepat.", type: "LUNARETH" },
      { text: "Tetap pada rencana awal sebaik mungkin.", type: "THARITH" },
      { text: "Menyesuaikan diri dengan fleksibel.", type: "ELARITH" },
      { text: "Pastikan solusi tidak melanggar prinsip.", type: "ZERYTH" },
    ],
  },
  {
    question:
      "Bagaimana kamu menjaga konsistensi dalam menyelesaikan tugas sehari-hari?",
    options: [
      {
        text: "Dengan motivasi kepemimpinan dan visi besar.",
        type: "SOLARIETH",
      },
      { text: "Dengan disiplin analisis dan detail teknis.", type: "VARNETH" },
      { text: "Dengan mencoba cara baru agar tidak bosan.", type: "AERYTH" },
      { text: "Dengan dukungan dan kerja sama orang lain.", type: "NIVARETH" },
      { text: "Dengan tekad pribadi yang kuat.", type: "LUNARETH" },
      {
        text: "Dengan rutinitas yang stabil dan terstruktur.",
        type: "THARITH",
      },
      { text: "Dengan tantangan baru sebagai pemicu.", type: "ELARITH" },
      { text: "Dengan komitmen pada nilai dan integritas.", type: "ZERYTH" },
    ],
  },
  {
    question:
      "Apa hal yang kamu lakukan untuk meningkatkan efektivitas dirimu?",
    options: [
      { text: "Belajar leadership dan strategi baru.", type: "SOLARIETH" },
      { text: "Mengasah skill teknis dan analisa.", type: "VARNETH" },
      { text: "Eksperimen dengan ide-ide segar.", type: "AERYTH" },
      { text: "Belajar komunikasi dan empati.", type: "NIVARETH" },
      { text: "Latihan mengambil keputusan cepat.", type: "LUNARETH" },
      { text: "Meningkatkan kedisiplinan rutinitas.", type: "THARITH" },
      { text: "Mencari tantangan lebih besar.", type: "ELARITH" },
      { text: "Menguatkan prinsip etika diri.", type: "ZERYTH" },
    ],
  },
  {
    question:
      "Bagaimana kamu biasanya berinteraksi dengan orang baru atau tim baru?",
    options: [
      {
        text: "Muncul percaya diri dan jadi pusat perhatian.",
        type: "SOLARIETH",
      },
      {
        text: "Observasi dulu, bicara berdasarkan data/fakta.",
        type: "VARNETH",
      },
      { text: "Menyapa ramah dan berbagi ide kreatif.", type: "AERYTH" },
      { text: "Berusaha akrab dan mendengarkan mereka.", type: "NIVARETH" },
      { text: "To the point, langsung ajak kerja sama.", type: "LUNARETH" },
      { text: "Formal dan sesuai aturan.", type: "THARITH" },
      { text: "Santai dan mudah menyesuaikan diri.", type: "ELARITH" },
      { text: "Tegas, transparan, dan jujur.", type: "ZERYTH" },
    ],
  },
  {
    question:
      "Apa yang biasanya kamu lakukan saat ada konflik dalam pekerjaan?",
    options: [
      { text: "Ambil alih dan arahkan agar cepat selesai.", type: "SOLARIETH" },
      {
        text: "Gunakan logika dan analisa untuk cari solusi.",
        type: "VARNETH",
      },
      { text: "Tawarkan ide kreatif untuk jalan tengah.", type: "AERYTH" },
      { text: "Jadi penengah dan dengerin semua pihak.", type: "NIVARETH" },
      { text: "Tegas, cepat ambil keputusan sendiri.", type: "LUNARETH" },
      { text: "Ikuti prosedur yang berlaku.", type: "THARITH" },
      {
        text: "Cari tantangan untuk menyelesaikan dengan cara baru.",
        type: "ELARITH",
      },
      {
        text: "Pegang teguh integritas, jangan kompromi salah.",
        type: "ZERYTH",
      },
    ],
  },
  {
    question:
      "Bagaimana kamu membantu teman atau rekan kerja yang sedang menghadapi kesulitan?",
    options: [
      { text: "Memberi arahan dan motivasi agar bangkit.", type: "SOLARIETH" },
      { text: "Membantu dengan analisa atau solusi teknis.", type: "VARNETH" },
      {
        text: "Mencarikan ide kreatif untuk mempermudah masalah.",
        type: "AERYTH",
      },
      {
        text: "Mendengarkan, memberi empati, dan dukungan emosional.",
        type: "NIVARETH",
      },
      {
        text: "Langsung turun tangan membantu secara praktis.",
        type: "LUNARETH",
      },
      {
        text: "Mengarahkan sesuai prosedur dan aturan kerja.",
        type: "THARITH",
      },
      { text: "Menawarkan sudut pandang baru dan fleksibel.", type: "ELARITH" },
      {
        text: "Menjadi penopang dengan kejujuran dan integritas.",
        type: "ZERYTH",
      },
    ],
  },
  {
    question:
      "Apa peran yang biasanya kamu ambil dalam kelompok atau komunitas?",
    options: [
      { text: "Pemimpin yang mengarahkan visi bersama.", type: "SOLARIETH" },
      { text: "Ahli analisa yang fokus pada detail.", type: "VARNETH" },
      { text: "Inovator yang membawa ide-ide baru.", type: "AERYTH" },
      { text: "Mediator yang menjaga keharmonisan tim.", type: "NIVARETH" },
      { text: "Eksekutor yang bergerak cepat.", type: "LUNARETH" },
      { text: "Penjaga struktur dan kedisiplinan.", type: "THARITH" },
      { text: "Penggerak yang adaptif sesuai situasi.", type: "ELARITH" },
      { text: "Penegak nilai dan etika kelompok.", type: "ZERYTH" },
    ],
  },
  {
    question:
      "Apa yang mendorongmu untuk mencapai tujuan tertentu dalam pekerjaan?",
    options: [
      { text: "Ambisi besar untuk memimpin dan berhasil.", type: "SOLARIETH" },
      {
        text: "Keinginan menyelesaikan masalah secara logis.",
        type: "VARNETH",
      },
      { text: "Kesempatan untuk mengekspresikan kreativitas.", type: "AERYTH" },
      { text: "Dukungan dan kolaborasi dengan orang lain.", type: "NIVARETH" },
      {
        text: "Dorongan tantangan yang harus segera ditaklukkan.",
        type: "LUNARETH",
      },
      {
        text: "Kepuasan dari keteraturan dan keberhasilan stabil.",
        type: "THARITH",
      },
      {
        text: "Semangat menghadapi situasi baru dan fleksibel.",
        type: "ELARITH",
      },
      { text: "Komitmen pada prinsip moral dan integritas.", type: "ZERYTH" },
    ],
  },
  {
    question: "Bagaimana cara kamu menentukan tujuan pribadi atau profesional?",
    options: [
      { text: "Menyusun visi besar dan target strategis.", type: "SOLARIETH" },
      { text: "Berdasarkan analisa data dan realitas.", type: "VARNETH" },
      {
        text: "Dengan mempertimbangkan ide segar atau peluang unik.",
        type: "AERYTH",
      },
      {
        text: "Melibatkan masukan orang-orang penting di sekitar.",
        type: "NIVARETH",
      },
      {
        text: "Menentukan cepat apa yang harus dicapai segera.",
        type: "LUNARETH",
      },
      {
        text: "Mengikuti prosedur atau langkah yang sudah terbukti.",
        type: "THARITH",
      },
      { text: "Membiarkan tujuan berkembang sesuai situasi.", type: "ELARITH" },
      { text: "Memastikan tujuan selaras dengan nilai moral.", type: "ZERYTH" },
    ],
  },
  {
    question: "Apa yang biasanya membuatmu termotivasi untuk bertindak?",
    options: [
      { text: "Keinginan memimpin dan mencapai prestasi.", type: "SOLARIETH" },
      { text: "Rasa puas saat menemukan solusi logis.", type: "VARNETH" },
      { text: "Semangat mencoba ide kreatif baru.", type: "AERYTH" },
      { text: "Hubungan baik dan dukungan dari orang lain.", type: "NIVARETH" },
      {
        text: "Adrenalin menyelesaikan sesuatu dengan cepat.",
        type: "LUNARETH",
      },
      { text: "Keteraturan dan keberhasilan yang konsisten.", type: "THARITH" },
      { text: "Kebebasan menghadapi tantangan baru.", type: "ELARITH" },
      {
        text: "Keyakinan bahwa saya bertindak sesuai prinsip benar.",
        type: "ZERYTH",
      },
    ],
  },
  {
    question:
      "Jika diberi kesempatan, apa hal baru yang ingin kamu coba atau capai?",
    options: [
      { text: "Memimpin proyek besar dengan dampak luas.", type: "SOLARIETH" },
      {
        text: "Mencoba riset atau analisa mendalam di bidang baru.",
        type: "VARNETH",
      },
      { text: "Mengembangkan karya kreatif atau inovasi.", type: "AERYTH" },
      { text: "Membangun komunitas atau tim yang solid.", type: "NIVARETH" },
      {
        text: "Mengejar target ambisius dalam waktu singkat.",
        type: "LUNARETH",
      },
      {
        text: "Mengambil sertifikasi atau jalur profesional terstruktur.",
        type: "THARITH",
      },
      { text: "Menjelajah peluang di luar zona nyaman.", type: "ELARITH" },
      { text: "Membuat program yang berlandaskan integritas.", type: "ZERYTH" },
    ],
  },
  {
    question: "Apa yang paling membuatmu tidak nyaman dalam pekerjaan?",
    options: [
      { text: "Kurangnya tantangan atau arah yang jelas.", type: "SOLARIETH" },
      { text: "Ketidakakuratan data atau informasi.", type: "VARNETH" },
      { text: "Lingkungan yang membatasi kreativitas.", type: "AERYTH" },
      { text: "Sikap tidak peduli atau kurang empati.", type: "NIVARETH" },
      { text: "Proses kerja yang terlalu lambat.", type: "LUNARETH" },
      { text: "Ketidakpastian dan perubahan mendadak.", type: "THARITH" },
      { text: "Rutinitas monoton tanpa variasi.", type: "ELARITH" },
      { text: "Ketidakjujuran atau perilaku tidak etis.", type: "ZERYTH" },
    ],
  },
  {
    question:
      "Bagaimana kamu biasanya bereaksi ketika menghadapi situasi tidak sesuai harapan?",
    options: [
      { text: "Tetap memimpin dan mencari jalan baru.", type: "SOLARIETH" },
      {
        text: "Menganalisis ulang untuk memahami akar masalah.",
        type: "VARNETH",
      },
      { text: "Mengubah pendekatan dengan ide baru.", type: "AERYTH" },
      {
        text: "Mencari dukungan atau saran dari orang lain.",
        type: "NIVARETH",
      },
      {
        text: "Bertindak cepat untuk menutup celah masalah.",
        type: "LUNARETH",
      },
      {
        text: "Bertahan dengan rencana yang ada sebaik mungkin.",
        type: "THARITH",
      },
      {
        text: "Menyesuaikan diri dengan fleksibilitas tinggi.",
        type: "ELARITH",
      },
      {
        text: "Tetap berpegang pada nilai yang saya yakini benar.",
        type: "ZERYTH",
      },
    ],
  },
  {
    question:
      "Hal apa yang biasanya kamu hindari karena tidak ingin merasa gagal?",
    options: [
      { text: "Kehilangan kendali atau pengaruh.", type: "SOLARIETH" },
      { text: "Kesalahan perhitungan atau data yang salah.", type: "VARNETH" },
      { text: "Gagal mengekspresikan kreativitas.", type: "AERYTH" },
      { text: "Konflik yang merusak hubungan.", type: "NIVARETH" },
      { text: "Tidak mampu bertindak cepat.", type: "LUNARETH" },
      { text: "Kekacauan yang merusak keteraturan.", type: "THARITH" },
      { text: "Terjebak rutinitas tanpa tantangan baru.", type: "ELARITH" },
      { text: "Mengorbankan prinsip atau integritas.", type: "ZERYTH" },
    ],
  },
  {
    question:
      "Apa yang biasanya membuatmu merasa stres atau frustrasi dalam pekerjaan?",
    options: [
      { text: "Kurangnya arahan atau kepemimpinan jelas.", type: "SOLARIETH" },
      { text: "Data yang tidak konsisten atau rancu.", type: "VARNETH" },
      { text: "Lingkungan yang menekan kreativitas.", type: "AERYTH" },
      { text: "Hubungan kerja yang penuh konflik.", type: "NIVARETH" },
      { text: "Proses yang lambat dan bertele-tele.", type: "LUNARETH" },
      { text: "Perubahan tiba-tiba tanpa prosedur jelas.", type: "THARITH" },
      { text: "Tugas monoton tanpa variasi menantang.", type: "ELARITH" },
      { text: "Tindakan yang bertentangan dengan etika.", type: "ZERYTH" },
    ],
  },
];

export default Questions;
