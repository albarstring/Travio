import { useEffect } from 'react';
import AOS from 'aos';
import 'aos/dist/aos.css';

export default function Marketers() {
  useEffect(() => {
    AOS.init({
      duration: 1000,
      once: true,
      offset: 100,
    });
  }, []);

  return (
    <div className="w-full relative overflow-x-hidden bg-[#060606]">
      {/* Hero Section */}
      <section className="relative w-full h-[600px] flex items-center justify-center">
        {/* Background Image with Overlay */}
        <div
          className="absolute inset-0 bg-cover bg-center bg-no-repeat"
          style={{ backgroundImage: "url('/public/bahan/computer.webp')" }}
        >
          <div className="absolute inset-0 bg-black/60"></div>
        </div>

        {/* Content */}
        <div className="relative z-10 text-center text-white px-4">
          <h1 className="text-4xl sm:text-5xl md:text-7xl font-bold mb-4" data-aos="fade-up">
            MARKETERS
          </h1>
          <p className="text-lg font-bold md:text-lg tracking-wide" data-aos="fade-up" data-aos-delay="100">
            JANGKAUAN ITU PENTING DAN BISA DIUKUR OTOMATIS
          </p>
        </div>
      </section>

      {/* Billboard Rental Section */}
      <section className="w-full bg-white py-12 px-4">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-2xl md:text-3xl text-black font-bold text-left mb-6" data-aos="fade-up">
            SEWA BILLBOARD DENGAN DATA PERFORMA DAN{" "}
            <span className="text-[#A8DF34]">MONITORING SETIAP SAAT</span>
          </h2>
          <p className="text-gray-700 text-wrap text-left mb-12 max-w-6xl leading-relaxed">
            Sebagai marketers, posisi anda akan naik kelas ketika anda berhasil
            mempertanggung jawabkan setiap rupiah yang anda investasikan di
            kanal iklan offline dengan data konkret, bukan sekedar feeling atau
            over klaim “lokasi ini strategis”. Dengan Insight Traffic, pola
            audiences, dan indikator lead per titik, anda bisa memotong titik
            yang boros dan mengalihkan budget kepada titik yang benar benar
            bekerja, serta menyusun strategi kreatif dan media plan yang jauh
            lebih tajam.
          </p>

          {/* Three Benefits Cards */}
          <div className="grid md:grid-cols-3 gap-8">
            {/* Card 1 */}
            <div className="bg-white shadow-lg text-center" data-aos="fade-up" data-aos-delay="100">
              {/* Header Icon */}
              <div className="bg-[#A8DF34] py-6 flex justify-center overflow-hidden">
                <img
                  src="/public/bahan/eye1.png"
                  alt=""
                  className="h-8 w-8 scale-125"
                />
              </div>

              {/* Content */}
              <div className="px-6 py-8">
                <h3 className="font-bold text-black text-2xl mb-10">
                  Efisiensi Budget
                </h3>
                <p className="text-sm text-gray-600 leading-relaxed">
                  karena marketers bisa melihat reach, pola pergerakan
                  audiences, dan indikator traffic/lead dari setiap titik.
                </p>
              </div>
            </div>

            {/* Card 2 */}
            <div className="bg-white shadow-lg text-center" data-aos="fade-up" data-aos-delay="200">
              <div className="bg-[#A8DF34] py-6 flex justify-center overflow-hidden">
                <img
                  src="/bahan/chart.png"
                  alt=""
                  className="h-8 w-8 scale-125"
                />
              </div>
              <div className="px-6 py-8">
                <h3 className="font-bold text-black text-2xl mb-10">
                  High Impact
                </h3>
                <p className="text-sm text-gray-600 leading-relaxed">
                  Membantu menyusun strategi iklan yang lebih berdampak titik
                  mana yang dipertahankan, mana yang dipotong, jam mana yang
                  penting, serta jenis kreatif apa yang lebih relevan dengan
                  pola audiens.
                </p>
              </div>
            </div>

            {/* Card 3 */}
            <div className="bg-white shadow-lg text-center" data-aos="fade-up" data-aos-delay="300">
              <div className="bg-[#A8DF34] py-6 flex justify-center">
                <img
                  src="/bahan/clock.png"
                  alt=""
                  className="h-8 w-8 scale-125"
                />
              </div>
              <div className="px-6 py-8">
                <h3 className="font-bold text-black text-2xl mb-10">
                  Bukti Objektif
                </h3>
                <p className="text-sm text-gray-600 leading-relaxed">
                  Memberikan bukti ke manajemen laporan kinerja OOH yang bisa
                  dipakai dalam presentasi internal tim untuk mempertahankan
                  atau menaikkan budget OOH.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section className="w-full bg-black text-white py-16 px-4">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-3xl md:text-4xl font-bold text-left mb-8" data-aos="fade-up">
            BAGAIMANA INI <span className="text-[#A8DF34]">BEKERJA?</span>
          </h2>

          <p className="text-left text-gray-300 mb-16 max-w-6xl">
            Akuntabilitas lengkap dari dashboard dengan tampilan tunggal yang
            didukung dengan fitur live streaming pada setiap titik billboard
            dapat membantu marketers untuk tetap melihat secara langsung
            aktivitas yang terjadi di depan iklan billboard mereka, misalnya
            melihat kepadatan, mengukur titik satu dengan titik lainnya,
            sehingga fitur ini menjadi tools yang bisa diandalkan untuk
            keberhasilan kampanye dengan media billboard statis.
          </p>

          {/* Step 1 */}
          <div className="grid md:grid-cols-2 gap-8 md:gap-12 items-center mb-20">
            {/* IMAGE */}
            <div className="flex justify-center" data-aos="fade-right">
              <img src="/bahan/1.png" alt="" className="w-80" />
            </div>

            {/* TEXT */}
            <div className="text-left" data-aos="fade-left">
              <h3 className="text-2xl font-bold mb-4">
                1. ALUR KERJA YANG LENGKAP DAN{" "}
                <span className="text-[#A8DF34]">100% TRANSPARAN</span>
              </h3>

              <p className="text-gray-300 leading-relaxed max-w-xl">
                Travio akan memberikan informasi titik media billboard strategis
                atau sesuai dengan keinginan klien, lalu semua media promosi
                yang dipilih akan di lock dan dipersiapkan untuk proses
                instalasi fitur analitik AI dari tim travio. Klien akan
                mendapatkan hak akses pada dashboard travio, di mana klien akan
                mendapatkan informasi data insight selama iklan tayang.
                Pelaporan hasil kampanye akan dibuat secara otomatis melalui
                kiriman data dari camera pintar travio sesuai dengan fitur yang
                digunakan klien selama iklan ditayangkan.
              </p>
            </div>
          </div>

          {/* Step 2 */}
          <div className="grid md:grid-cols-2 gap-12 items-center mb-20">
            {/* KIRI - IMAGE */}
            <div className="flex justify-center order-1 md:order-2" data-aos="fade-left">
              <img src="/bahan/2.png" alt="" className="w-80" />
            </div>

            <div className="text-left order-2 md:order-1" data-aos="fade-right">
              <h3 className="text-2xl font-bold mb-4">
                2. TEMUKAN LOKASI DENGAN PERFORMA{" "}
                <span className="text-[#A8DF34]">PALING TINGGI</span>
              </h3>

              <p className="text-gray-300 leading-relaxed max-w-xl">
                Manfaatkan lokasi media billboard premium untuk menayangkan
                iklan anda secara efektif melalui informasi dari tim travio,
                lalu padukan informasi ini dengan tim anda untuk menentukan
                kampanye yang sesuai dengan tujuan marketing. Travio akan
                membantu memberikan rekomendasi konten yang relevan dan efektif
                untuk meningkatkan performa brand anda, FItur AI pada billboard
                kami akan menghitung dan menganalisis aktivitas traffic di depan
                billboard anda secara real-time, sehingga dimungkinkan marketers
                akan mudah untuk membandingkan titik mana yang masuk pada
                kategori audiens potensial.
              </p>
            </div>
          </div>

          {/* Step 3 */}
          <div className="grid md:grid-cols-2 gap-8 md:gap-12 items-center mb-20">
            {/* KIRI - IMAGE */}
            <div className="flex justify-center " data-aos="fade-right">
              <img src="/bahan/4.png" alt="" className="w-80" />
            </div>

            {/* KANAN - TEXT */}
            <div className="text-left" data-aos="fade-left">
              <h3 className="text-2xl font-bold mb-4">
                3. IMPROVISASI KREATIF &{" "}
                <span className="text-[#A8DF34]">PENGUKURAN KPI</span>
              </h3>
              <p className="text-gray-300 leading-relaxed max-w-xl">
                Tim Travio akan melakukan peningkatan pada materi kreatif untuk
                memastikan keterbacaan guna memaksimalkan keterlibatan audiens,
                kepadatan kendaraan dan waktu tunggu akan menjadi basis
                penentuan materi iklan yang kreatif dan efektif. KPI dapat
                ditetapkan untuk mengukur perhatian yang dipicu di sekitar
                lokasi billboard yang dapat dilihat melalui dashboard, misalnya
                minat untuk menjelajahi situs perusahaan klien, code promo,
                unduhan aplikasi atau QR Code & peningkatan pejalan kaki di
                sekitaran toko ritel dan mall, pertanyaan respons langsung
                melalui nomor telepon yang disebutkan pada iklan.
              </p>
            </div>
          </div>

          {/* Step 4 */}
          <div className="grid md:grid-cols-2 gap-12 items-center mb-20">
            {/* KIRI - IMAGE */}
            <div className="flex justify-center order-1 md:order-2" data-aos="fade-left">
              <img src="/bahan/5.png" alt="" className="w-80" />
            </div>
            {/* KANAN - TEXT */}
            <div className="text-left order-2 md:order-1" data-aos="fade-right">
              <h3 className="text-2xl font-bold mb-4">
                4. INSTALASI DENGAN METODE KONVENSIONAL DENGAN{" "}
                <span className="text-[#A8DF34]">ANALISA MODERN</span>
              </h3>

              <p className="text-gray-300 leading-relaxed max-w-xl">
                Seluruh proses instalasi iklan pada media billboard akan
                diupayakan berjalan semulus mungkin, Travio telah bermitra
                strategis dengan pemilik media billboard untuk memastikan
                ketersediaan stock secara real-time, gambar dan kondisi kampanye
                akan diberikan kepada klien melalui dashboard yang dapat diakses
                dari mana saja, permintaan perubahan atau pergantian materi
                iklan akan travio follow up sesuai dengan data potensial yang
                dapat dilihat di dalam dashboard.
              </p>
            </div>
          </div>

          {/* Step 5 */}
          <div className="grid md:grid-cols-2 gap-8 md:gap-12 items-center mb-20">
            {/* KIRI - IMAGE */}
            <div className="flex justify-center " data-aos="fade-right">
              <img src="/bahan/6.png" alt="" className="w-80" />
            </div>

            {/* KANAN - TEXT */}
            <div className="text-left" data-aos="fade-left">
              <h3 className="text-2xl font-bold mb-4">
                5. KETERLIBATAN
                <span className="text-[#A8DF34]"> TRAVIO </span>
                DENGAN BRAND / AGENCY
              </h3>
              <p className="text-gray-300 leading-relaxed max-w-xl">
                Travio menyediakan layanan advertising mulai dari perencanaan
                audiens, pemilihan lokasi, eksekusi dan pelaporan kampanye
                dengan tetap mengutamakan pengukuran audiens dan menghindari
                pemborosan iklan.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="w-full bg-white py-24 px-4">
        <div className="max-w-5xl mx-auto text-center">
          <h2 className="text-xl md:text-2xl text-black font-bold mb-6 leading-tight" data-aos="fade-up">
            PASANG IKLAN BILLBOARD DENGAN FITUR ANALITIK BERBASIS TEKNOLOGI AI
            VISION. JELAJAHI BAGAIMANA TRAVIO DAPAT MEMBANTU BRAND ANDA MENCAPAI
            KPI PEMASARAN ANDA.
          </h2>
          <p className="text-gray-600 mb-8">
            Teknologi Terdepan dan Modern | Data Maksimum | Kreatif Materi |
            Pengukuran Pasti | Dashboard Informatif
          </p>
          <button className="bg-[#A8DF34] text-black px-4 py-2 rounded-lg font-bold text-lg shadow-xl">
            HUBUNGI KAMI SEKARANG
          </button>
        </div>
      </section>
    </div>
  );
}
