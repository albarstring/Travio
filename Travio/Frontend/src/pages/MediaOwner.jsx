import { useEffect } from 'react';
import AOS from 'aos';
import 'aos/dist/aos.css';

export default function MediaOwner() {
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
          className="absolute inset-0 bg-cover bg-center bg-no-repeat" style={{ backgroundImage: "url('/bahan/city.webp')" }} 
        >
          <div className="absolute inset-0 bg-black/60"></div>
        </div>
        
        {/* Content */}
        <div className="relative z-10 text-center text-white px-4">
          <h1 className="text-6xl sm:text-8xl font-bold mb-4" data-aos="fade-up">MEDIA OWNER</h1>
          <p className="text-lg font-bold md:text-lg tracking-wide" data-aos="fade-up" data-aos-delay="100">TINGKATKAN NILAI SEWA BILLBOARD ANDA DENGAN DUKUNGAN DATA PERFORMA</p>
        </div>
      </section>

      {/* Billboard Rental Section */}
      <section className="w-full bg-white py-12 px-4">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-2xl md:text-3xl text-black font-bold text-left mb-6" data-aos="fade-up">
            BUAT REVENUE STREAM BARU DENGAN LEBIH CEPAT DAN OPTIMALKAN LOKASI OOH ANDA DENGAN <span className="text-[#A8DF34]">DATA ANALISIS  PERFORMA</span>
          </h2>
          <p className="text-gray-700 text-wrap text-left mb-12 max-w-6xl leading-relaxed">
            Dengan data traffic dan pola audiences per titik, nilai media anda akan meningkat dan menjadi opsi terbaik para pengiklan, karena mereka terbantu untuk mengoptimalkan budget iklan luar ruang yang lebih efisien. Travio bekerja sama dengan media anda untuk memberikan nilai lebih berupa data, misalnya jam ramai, hari ramai, siapa yang lewat, brand apa paling banyak lewat depan billboard anda, anda juga dapat merekomendasikan titik mana yang paling potensial untuk kategori industri tertentu dengan berdasar pada data performa, bukan asumsi.
          </p>

          {/* Three Benefits Cards */}
          <div className="grid md:grid-cols-3 gap-8">
            
            {/* Card 1 */}
            <div className="bg-white shadow-lg text-center" data-aos="fade-up" data-aos-delay="100">
              {/* Header Icon */}
              <div className="bg-[#A8DF34] py-6 flex justify-center overflow-hidden">
                <img src="/bahan/pintu.png" alt="" className="h-8 w-8 scale-125" />
              </div>

              {/* Content */}
              <div className="px-6 py-8">
                <h3 className="font-bold text-black text-2xl mb-10">
                  Jual media base on data insight
                </h3>
                <p className="text-sm text-gray-600 leading-relaxed">
                 Saat ini setiap titik media OOH anda memiliki data performa berupa data traffic kendaraan dan profile audience, bukan lagi hanya klaim yang bersifat subjektif.
                </p>
              </div>
            </div>

            {/* Card 2 */}
            <div className="bg-white shadow-lg text-center" data-aos="fade-up" data-aos-delay="200">
              <div className="bg-[#A8DF34] py-6 flex justify-center overflow-hidden">
                <img src="/bahan/snow.png" alt="" className="h-8 w-8 scale-125" />
              </div>
              <div className="px-6 py-8">
                <h3 className="font-bold text-black text-2xl mb-10">
                  Rate Card
                </h3>
                <p className="text-sm text-gray-600  leading-relaxed mt-16">
                  Rate card media anda akan meningkat, karena bisa memberikan informasi data performa berupa jam ramai, jenis audience, dan estimasi dampak kepada klien.
                </p>
              </div>
            </div>

            {/* Card 3 */}
            <div className="bg-white shadow-lg text-center" data-aos="fade-up" data-aos-delay="300">
              <div className="bg-[#A8DF34] py-6 flex justify-center overflow-hidden">
                <img src="/bahan/edit.png" alt="" className="h-8 w-8 scale-125" />
              </div>
              <div className="px-6 py-8">
                <h3 className="font-bold text-black text-2xl mb-10">
                  Portfolio
                </h3>
                <p className="text-sm text-gray-600 leading-relaxed">
                  Anda sekarang bisa mengetahui dan mengevaluasi titik mana yang ramai namun masih dengan harga yang rendah dan mana yang perlu diperbaiki atau ditata ulang.
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
            BEKERJA SAMA DENGAN KAMI, <span className="text-[#A8DF34]">ALUR PENDAFTARAN MEDIA</span>
          </h2>

          <p className="text-left text-gray-300 mb-16 max-w-6xl">
            Travio merupakan platform jaringan iklan dengan media OOH yang didukung dengan kecanggihan teknologi AI sebagai alat yang menghasilkan data performa, Kami membantu pemilik media memaksimalkan nilai situs media mereka melalui otomatisasi, optimasi bisnis dan dukungan untuk transaksi terprogram dengan transparansi penuh dalam hal persiapan dan pelaporan kepada klien. 
          </p>

         {/* Step 1 */}
          <div className="grid md:grid-cols-2 gap-8 md:gap-12 items-center mb-20">

            {/* IMAGE */}
            <div className="flex justify-center" data-aos="fade-right">
              <img src="/bahan/Map.png" alt="" className="w-80" />
            </div>

            {/* TEXT */}
            <div className="text-left" data-aos="fade-left">
              <h3 className="text-2xl font-bold mb-4">
                1. PEMETAAN MEDIA OOH DI {" "}
                <span className="text-[#A8DF34]">AREA STRATEGIST.</span>
              </h3>

              <p className="text-gray-300 leading-relaxed max-w-xl">
                System kami dapat digunakan di semua media OOh termasuk billboard statis, ketika media owner telah memiliki inventory di lokasi strategis, sampaikan kepada tim travio, kami akan meningkatkan value media tersebut untuk penjualan dengan harga yang lebih kompetitif, tidak semua media OOH di indonesia memiliki fitur analitik transparan seperti travio platform.
              </p>
            </div>

          </div>


          {/* Step 2 */}
          <div className="grid md:grid-cols-2 gap-12 items-center mb-20">
            
            {/* KIRI - IMAGE */}
            <div className="flex justify-center order-1 md:order-2" data-aos="fade-left">
              <img src="/bahan/8.png" alt="" className="w-80" />
            </div>

            <div className="text-left order-2 md:order-1" data-aos="fade-right">
              <h3 className="text-2xl font-bold mb-4">
                2. MENJUAL INVENTORI OOH ANDA  {" "}
                <span className="text-[#A8DF34]">DENGAN LENGKAP</span>
              </h3>

              <p className="text-gray-300 leading-relaxed max-w-xl">
                Nilai investasi media OOH akan meningkat ketika dapat diukur dan dianalisa dengan baik. Dengan Travio Platform, media OOH anda akan kami teruskan kepada marketers sebagai solusi iklan luar ruang dengan fitur lengkap, termasuk pelaporan yang mudah dan lokasi strategis, ini membuat trust media OOH anda meningkat, karena marketers butuh nilai base on data, bukan hanya prediksi tanpa dasar. 
              </p>
            </div>
          </div>

          {/* Step 3 */}
          <div className="grid md:grid-cols-2 gap-8 md:gap-12 items-center mb-20">
            
            {/* KIRI - IMAGE */}
            <div className="flex justify-center " data-aos="fade-right">
              <img src="/bahan/1.png" alt="" className="w-80" />
            </div>

            {/* KANAN - TEXT */}
            <div className="text-left" data-aos="fade-left">
              <h3 className="text-2xl font-bold mb-4">
                3. ALUR KERJA YANG LENGKAP DAN {" "}
                <span className="text-[#A8DF34]">100% TRANSPARAN</span>
              </h3>
              <p className="text-gray-300 leading-relaxed max-w-xl">
                Travio akan memberikan informasi titik media billboard strategis atau sesuai dengan keinginan klien, lalu semua media promosi yang dipilih akan di lock dan dipersiapkan untuk proses instalasi fitur analitik AI dari tim travio. Klien akan mendapatkan hak akses pada dashboard travio, di mana klien akan mendapatkan informasi data insight selama iklan tayang. Pelaporan hasil kampanye akan dibuat secara otomatis melalui kiriman data dari camera pintar travio sesuai dengan fitur yang digunakan klien selama iklan ditayangkan. 
              </p>
            </div>
          </div>

          {/* Step 4 */}
          <div className="grid md:grid-cols-2 gap-12 items-center mb-20">
            {/* KIRI - IMAGE */}
            <div className="flex justify-center order-1 md:order-2" data-aos="fade-left">
              <img src="/bahan/10.png" alt="" className="w-80" />
            </div>
            {/* KANAN - TEXT */}
            <div className="text-left order-2 md:order-1" data-aos="fade-right">
              <h3 className="text-2xl font-bold mb-4">
                4. POTENSI PENDAPATAN OLEH MEDIA OWNER DENGAN  {" "}
                <span className="text-[#A8DF34]">ARINGAN IKLAN TRAVIO</span>
              </h3>

              <p className="text-gray-300 leading-relaxed max-w-xl">
                Melalui skema kerja sama partnership, Travio dengan media owner akan bersama-sama berperan aktif menjual inventory media OOH dengan jaringan iklan yang tersedia. Semua perangkat dan pengembangan teknologi akan dikerjakan oleh tim dari travio, media owner hanya menyediakan titik spot OOH yang bisa disampaikan secara real-time, hal ini dilakukan agar informasi paket media bisa lancar tersampaikan kepada marketers. 
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="w-full bg-white py-24 px-4">
        <div className="max-w-5xl mx-auto text-center">
          <h2 className="text-xl md:text-2xl text-black font-bold mb-6 leading-tight" data-aos="fade-up">
            TRAVIO AKAN SELALU MEMBERIKAN LAYANAN SEWA MEDIA IKLAN TERBAIK TERMASUK TRANSPARANSI INFORMASI 
          </h2>
          <p className="text-gray-600 mb-8">
            Lebih dari 100+ titik di Banten | Sewa Billboard | Jasa Bikin Website | Jasa Optimisasi Google Bisnis | Dashboard Informatif
          </p>
          <button className="bg-[#A8DF34] text-black px-4 py-2 rounded-lg font-bold text-lg shadow-xl">
            HUBUNGI KAMI SEKARANG
          </button>
        </div>
      </section>
      
      
    </div>
  );
}
