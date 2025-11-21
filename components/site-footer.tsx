import Link from "next/link"

export function SiteFooter() {
  return (
    <footer className="bg-[#1c4587] text-white mt-auto">
      <div className="container mx-auto px-4 py-8">
        <div className="grid md:grid-cols-3 gap-8 mb-6">
          <div>
            <h3 className="font-bold text-lg mb-3">AAI TSA</h3>
            <p className="text-sm text-blue-100">
              Alliance Academy International Technology Student Association Chapter
            </p>
            <p className="text-sm text-blue-100 mt-2">
              Empowering students through technology, innovation, and leadership.
            </p>
          </div>
          <div>
            <h4 className="font-semibold mb-3">Quick Links</h4>
            <ul className="space-y-2 text-sm">
              <li>
                <Link href="/resources" className="text-blue-100 hover:text-white transition-colors">
                  Resources
                </Link>
              </li>
              <li>
                <Link href="/gallery" className="text-blue-100 hover:text-white transition-colors">
                  Gallery
                </Link>
              </li>
              <li>
                <Link href="/team" className="text-blue-100 hover:text-white transition-colors">
                  Team
                </Link>
              </li>
              <li>
                <Link href="/contact" className="text-blue-100 hover:text-white transition-colors">
                  Contact
                </Link>
              </li>
            </ul>
          </div>
          <div>
            <h4 className="font-semibold mb-3">School Info</h4>
            <p className="text-sm text-blue-100">
              Alliance Academy
              <br />
              Cumming, Georgia, USA
            </p>
            <p className="text-sm text-blue-100 mt-4">Website designed by Akhil Akella and Akshara Chunduri</p>
          </div>
        </div>
        <div className="border-t border-blue-400 pt-6 text-center text-sm text-blue-100">
          <p>© {new Date().getFullYear()} Alliance Academy TSA Chapter. All rights reserved.</p>
        </div>
      </div>
    </footer>
  )
}
