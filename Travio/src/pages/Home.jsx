import Footer from '../components/Footer';
import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import AOS from 'aos';
import CountUp from 'react-countup';
import 'aos/dist/aos.css';

export default function Home() {
  const [isStatsVisible, setIsStatsVisible] = useState(false);
  const [heroLabel, setHeroLabel] = useState('BRAND');
  const [isLabelFading, setIsLabelFading] = useState(false);

  useEffect(() => {
    AOS.init({
      duration: 1000,
      once: true,
      offset: 100,
    });
  }, []);

  useEffect(() => {
    const interval = setInterval(() => {
      setIsLabelFading(true);
      setTimeout(() => {
        setHeroLabel((prev) => (prev === 'BRAND' ? 'MEDIA' : 'BRAND'));
        setIsLabelFading(false);
      }, 300);
    }, 3600);

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="w-full relative overflow-x-hidden">
      {/* Fixed Background Image */}
      <div 
        className="fixed inset-0 bg-cover bg-center bg-no-repeat -z-10" 
        style={{ backgroundImage: "url('/bahan/Images-Website.webp')" }}
      >
        <div className="absolute inset-0 bg-black bg-opacity-60"></div>
      </div>

      {/* Hero Section */}
      <section className="relative w-full h-screen">
        <div className="relative z-10 max-w-6xl mx-auto px-4 h-full flex flex-col justify-center items-center text-white text-center">
          <h2 className="text-4xl md:text-6xl font-bold mb-4" data-aos="fade-up">
            <span className={`transition-opacity duration-300 ${isLabelFading ? 'opacity-0' : 'opacity-100'}`}>
              HALLO
            </span>
            <span
              className={`ml-2 text-4xl md:text-6xl text-black rounded-xl px-2 bg-[#A8DF34] font-bold transition-opacity duration-300 ${isLabelFading ? 'opacity-0' : 'opacity-100'}`}
            >
              {heroLabel}
            </span>
          </h2>
          <p className="text-lg md:text-xl font-bold mb-6 mt-2" data-aos="fade-up" data-aos-delay="100">
            ERA BARU PENGUKURAN IKLAN BILLBOARD STATIS DENGAN AI SUDAH TERSEDIA
          </p>
          <p className="text-lg md:text-xl mb-8 max-w-3xl mt-10" >
          AI KAMI MEMBANTU MENGUKUR DATA PERFORMA BILLBOARD ANDA REAL-TIME TERSEDIA LEBIH DARI <span className="text-[#A8DF34] font-semibold">100+ titik</span> MEDIA BILLBOARD DI PROVINSI BANTEN.
          </p>
          <div data-aos="fade-up" data-aos-delay="300">
            <button className="border-2 bg-[#A8DF34] text-black hover:text-gray-700 px-8 py-3 rounded-lg transition font-bold text-lg">
              Mulai Kampanye
            </button>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="w-full text-white py-0" onMouseEnter={() => setIsStatsVisible(true)}>
        <div className="max-w-6xl mx-auto px-4 -mt-12 py-16">
          <h2 className="text-3xl md:text-4xl font-bold text-center mb-8 max-w-xl mx-auto md:max-w-lg lg:max-w-xl" data-aos="fade-up">
            Kolaborasi dengan kami dan ukur keberhasilan kampanye OOH
          </h2>
          <div className="grid md:grid-cols-3 gap-8 text-center mt-6">
            <div data-aos="fade-up" data-aos-delay="100">
                <div className="text-5xl md:text-6xl font-bold text-[#A8DF34] mb-2">
                  {isStatsVisible ? <CountUp start={0} end={600} duration={2.5} /> : 0}
                  <span>+</span>
                </div>
                <p className="text-gray-300 text-lg">KERJASAMA BRAND</p>
            </div>
            <div data-aos="fade-up" data-aos-delay="200">
                <div className="text-5xl md:text-6xl font-bold text-[#A8DF34] mb-2">
                  {isStatsVisible ? <CountUp start={0} end={80} duration={2.5} /> : 0}
                  <span>%+</span>
                </div>
                <p className="text-gray-300 text-lg">TINGKAT RETENTION</p>
            </div>
            <div data-aos="fade-up" data-aos-delay="300">
                <div className="text-5xl md:text-6xl font-bold text-[#A8DF34] mb-2">
                  {isStatsVisible ? <CountUp start={0} end={100} duration={2.5} /> : 0}
                  <span>+</span>
                </div>
                <p className="text-gray-300 text-lg">KOTA MEDIA</p>
            </div>
            </div>

        </div>
      </section>

      {/* Billboard Section */}
      <section className="w-full bg-white py-20">
        <div className="max-w-6xl mx-auto px-4 grid md:grid-cols-2 gap-12 items-center">
          <div data-aos="fade-right">
            <h2 className="text-xl md:text-4xl font-semibold text-gray-900 mb-6">
              Sewa media billboard dengan percaya diri
            </h2>
            <p className="text-gray-600 text-lg mb-6">
              Rangkaian produk dan layanan berbasis teknologi AI, memungkinkan brand dan pengiklan mengelola, menganalisis, dan melaporkan kegiatan kampanye OOH dengan lebih baik dan terukur.
            </p>
            <button className="bg-[#A8DF34] text-black px-6 py-3 rounded-lg transition font-medium shadow-2xl">
              Konsultasi Gratis
            </button>
          </div>
          <div data-aos="fade-left">
            <img src="/bahan/Images-2.webp" alt="Billboard Dashboard" className="w-full transition-transform duration-300 ease-out hover:scale-105" />
          </div>
        </div>
      </section>

      {/* Dashboard Section */}
      <section className="w-full bg-[#A8DF34] py-32">
        <div className="max-w-6xl mx-auto px-4 grid md:grid-cols-2 gap-12 items-center">
          <div data-aos="fade-right">
            <img src="/bahan/3.webp" alt="Analytics Dashboard" className="w-full rounded-lg shadow-xl transition-transform duration-300 ease-out hover:scale-105" />
          </div>
          <div className="text-gray-900" data-aos="fade-left">
            <h2 className="text-2xl md:text-4xl font-semibold mb-6">
              Monitoring dan analisis dalam 1 Dashboard
            </h2>
            <p className="text-lg mb-6">
              Travio platform akan membantu anda monitoring dan analisis data traffic setiap titik iklan billboard anda secara real-time, dapatkan data nyata, bukan asumsi.
            </p>
            <button className="bg-gray-900 border-white shadow-2xl text-white px-6 py-3 rounded-lg hover:bg-gray-800 transition font-semibold">
              Request proposal
            </button>
          </div>
        </div>
      </section>

      {/* Optimization Section */}
      <section className="w-full bg-[#181818] py-24">
        <div className="max-w-6xl mx-auto px-4 grid md:grid-cols-2 gap-12 items-center">
          <div data-aos="fade-right">
            <h2 className="text-3xl md:text-4xl font-medium text-[#A8DF34] mb-6">
              Optimalkan waktu anda untuk hal yang lebih kompleks
            </h2>
            <p className="text-gray-300 text-lg mb-6">
              Anda cukup masuk ke dashboard dan lakukan perubahan sesuai dengan kebutuhan data anda, kami ingin memastikan waktu anda optimal untuk pekerjaan kampanye anda termasuk ROI.
            </p>
          </div>
          <div data-aos="fade-left">
            <img src="/bahan/9.webp" alt="Analytics" className="w-full rounded-lg shadow-xl transition-transform duration-300 ease-out hover:scale-105" />
          </div>
        </div>
      </section>

      {/* Traffic Measurement Section */}
      <section className="w-full bg-[#181818] py-28">
        <div className="max-w-6xl mx-auto px-4 grid md:grid-cols-2 gap-12 items-center">
          <div data-aos="fade-right">
            <img src="/bahan/ai.jpg" alt="OOH Media Measurement" className="w-full rounded-lg shadow-xl transition-transform duration-300 ease-out hover:scale-105" />
          </div>
          <div data-aos="fade-left">
            <h2 className="text-3xl md:text-4xl font-medium text-[#A8DF34] mb-6">
              Maksimalkan pengukuran semua titik media OOH anda
            </h2>
            <p className="text-white text-lg mb-6">
              Lihat metrik iklan anda untuk kampanye dengan media Billboard statis dalam satu dashboard yang intuitif. kami melaporkan tayangan (jumlah traffic) dengan cepat dan real-time, termasuk anda akan melihatnya sendiri dengan akses cloud.
            </p>
          </div>
        </div>
      </section>

      {/* Inspection Section */}
      <section className="w-full bg-black text-white py-24">
        <div className="max-w-6xl mx-auto px-4 grid md:grid-cols-2 gap-12 items-center">
          <div data-aos="fade-right">
            <h2 className="text-3xl md:text-4xl font-bold mb-6 text-[#A8DF34] max-w-lg">
              Lakukan lebih dari sekedar inspeksi fisik pada tayangan iklan billboard anda
            </h2>
            <p className="text-white text-lg mb-6">
              Kami mencakup 100% data performa semua titik kampanye billboard anda secara bersamaan untuk ketenangan dalam pengukuran.
            </p>
            <button className="bg-[#A8DF34] text-black px-6 py-3 mt-4 rounded-lg  transition font-semibold">
              Jadwalkan Meeting
            </button>
          </div>
          <div data-aos="fade-left">
            <img src="/bahan/data-analytic.webp" alt="Inspection Technology" className="w-full rounded-lg shadow-xl transition-transform duration-300 ease-out hover:scale-105" />
          </div>
        </div>
      </section>

      {/* Mission Section */}
      <section className="w-full bg-black  py-24">
        <div className="max-w-4xl mx-auto px-4 text-center" data-aos="fade-up">
          <h2 className="text-3xl text-[#A8DF34] md:text-4xl font-bold mb-8">
            Travio menghubungkan Marketers, Media owners dan Audiens secara langsung
          </h2>
          <p className="text-gray-300 text-lg leading-relaxed">
            Para marketer termasuk anda pasti mengalami kesulitan pada metode pengukuran iklan billboard statis anda sepanjang hari, di sinilah travio hadir dan berperan secara independen dalam rangka pengumpulan dan pengolahan data performa iklan billboard anda secara real-time. Kami tidak akan bergantung kepada siapapun termasuk pemilik media billboard, sehingga kami tetap independen dan transparan. <br />
<br />
Marketers akan percaya diri membeli titik billboard untuk beberapa waktu, dan pemilik media dapat membuktikan nilai performa billboard mereka pra penjualan, sehingga skema ini akan menguntungkan pada semua pihak.
<br />
<br  id="marketers"/>
Travio mendukung semua rangkaian kampanye dengan media billboard statis dan Digital (OOH & DOOH) dalam satu dashboard monitoring, seperti pengukuran jumlah kendaraan, demografi insight, area ramai dll. Tidak memerlukan integrasi dengan pemilik media, cukup anda lihat dari perangkat anda yang tersambung internet, lihat bagaimana titik billboard anda bekerja.
          </p>
        </div>

        <div className="flex items-center gap-3 text-white mt-10 justify-center">
          {/* Text kiri */}
          <div className="text-base border-r pr-4 leading-tight text-right opacity-80">
            <div>Smart</div>
            <div>Analytics</div>
            <div>Partners</div>
          </div>

          {/* Logo Tengah */}
          <img src="/public/bahan/Logo2.png" alt="" className='h-20' />
        </div>

        {/* Card */}
        <div className="max-w-6xl mx-auto px-4 mt-20">
    <div className="grid grid-cols-1 md:grid-cols-2 gap-12">

      {/* Card 1 */}
      <div className="bg-[#232323] text-white shadow-xl">
        {/* Header */}
        <div className="bg-[#A8DF34] text-black font-bold text-xl text-center px-6 py-4">
          Marketers to Audiences
        </div>

        {/* Content */}
        <div className="px-6 py-12 text-center">
          <h3 className="text-2xl font-bold leading-relaxed">
            Data Insight, AI <br />
            Detection, Dashboard
          </h3>

          <Link to="/marketers" className="mt-10 text-white hover:underline hover:underline-offset-8 text-sm tracking-widest hover:text-lime-400 transition block cursor-pointer">
            SELENGKAPNYA
          </Link>
        </div>
      </div>

      {/* Card 2 */}
      <div className="bg-[#232323] text-white shadow-xl">
          {/* Header */}
          <div className="bg-[#A8DF34] text-black font-bold text-xl text-center px-6 py-4">
            Media Owner to Marketers
          </div>

          {/* Content */}
            <div className="px-6 py-12 text-center">
              <h3 className="text-2xl font-bold leading-relaxed">
                Sewa Media OOH + Data <br />
                Insight
              </h3>
              <Link to="/media-owner" className="mt-10 px-6 py-2 text-white hover:underline hover:underline-offset-8 text-sm tracking-widest  hover:text-lime-400 transition block cursor-pointer">
                SELENGKAPNYA
              </Link>
            </div>
          </div>

        </div>
      </div>
      </section>

      {/* Contact Form Section */}
      <section className="w-full py-20">
        <div className="max-w-6xl mx-auto px-4">
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-12" data-aos="fade-up">
            CONTACT <span className="text-[#A8DF34]">US</span>
          </h2>
          <div className="grid md:grid-cols-2 gap-12">
            <div data-aos="fade-right">
              <form className="space-y-6">
                <div className="grid md:grid-cols-2 gap-6">
                  <input 
                    type="text" 
                    placeholder="Name" 
                    className="w-full px-4 py-3 bg-transparent border-b-2 border-gray-600 text-white placeholder-gray-400 focus:border-[#A8DF34] focus:outline-none"
                  />
                  <input 
                    type="email" 
                    placeholder="Email" 
                    className="w-full px-4 py-3 bg-transparent border-b-2 border-gray-600 text-white placeholder-gray-400 focus:border-[#A8DF34] focus:outline-none"
                  />
                </div>
                <div className="grid md:grid-cols-2 gap-6">
                  <input 
                    type="tel" 
                    placeholder="No Handphone" 
                    className="w-full px-4 py-3 bg-transparent border-b-2 border-gray-600 text-white placeholder-gray-400 focus:border-[#A8DF34] focus:outline-none"
                  />
                  <input 
                    type="text" 
                    placeholder="Company" 
                    className="w-full px-4 py-3 bg-transparent border-b-2 border-gray-600 text-white placeholder-gray-400 focus:border-[#A8DF34] focus:outline-none"
                  />
                </div>
                <textarea 
                  placeholder="Message" 
                  rows="4"
                  className="w-full px-4 py-3 bg-transparent border-b-2 border-gray-600 text-white placeholder-gray-400 focus:border-[#A8DF34] focus:outline-none resize-none"
                ></textarea>
                <button 
                  type="submit"
                  className="w-full bg-[#A8DF34] text-black px-8 py-3 rounded-lg transition font-semibold text-lg"
                >
                  Sent Message
                </button>
              </form>
            </div>
            <div className="h-96 bg-gray-800 rounded-lg overflow-hidden" data-aos="fade-left">
              <iframe 
                src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d495.89732151583553!2d106.12989935480176!3d-6.106641757592453!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x2e418bcc96e48497%3A0x20699ae9b53d80d6!2sCV%20BYAN%20CENTRAL%20COMPUTER!5e0!3m2!1sen!2sid!4v1768737592428!5m2!1sen!2sid"
                width="100%" 
                height="100%" 
                style={{ border: 0 }}
                allowFullScreen="" 
                loading="lazy"
                title="Location Map"
              ></iframe>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
