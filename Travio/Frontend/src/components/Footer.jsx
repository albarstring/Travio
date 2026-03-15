export default function Footer() {
  return (
    <footer className="w-full bg-black text-white py-12">
      <div className="max-w-6xl mx-auto px-4">
        <div className="grid md:grid-cols-4 gap-8">
          <div>
            <div className="flex items-center gap-2 mb-4">
              <img src="/public/bahan/logofooter.webp" alt="" className="h-20 transition-transform duration-300 ease-out hover:scale-105" />
            </div>
          </div>
          <div>
            <h3 className="font-bold mb-4">Alamat</h3>
            <p className="text-gray-400 text-sm">
              Marketting Office :<br />
              Pondok Taktakan Indah Blok AI22
              Kel. Drangong Kec. Taktakan
              Kota Serang. Banten
              Indonesia
            </p>
          </div>
          <div>
            <h3 className="font-bold mb-4">Layanan</h3>
            <ul className="space-y-1 text-gray-400 text-sm">
              <li>Sewa Billboard Statis</li>
              <li>Performa Billboard Statis</li>
              <li>Analisis Traffic Audiens</li>
            </ul>
          </div>
          <div>
            <h3 className="font-bold mb-4">Fitur Analisis</h3>
            <ul className="space-y-1 text-gray-400 text-sm">
              <li>Vehicle Analytics with Attribute</li>
              <li>People Analytics with Attribute</li>
              <li>Dashboard</li>
            </ul>
          </div>
        </div>
        <div className="border-t border-gray-800 mt-8 pt-8 text-center text-gray-400 text-sm">
          © 2026 Travio. All rights reserved.
        </div>
      </div>
    </footer>
  );
}
