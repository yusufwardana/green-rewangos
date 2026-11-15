'use client'

import { useMemo, useState } from 'react'
import {
  ArrowRight,
  Baby,
  BriefcaseBusiness,
  Check,
  CircleUserRound,
  HardHat,
  Home,
  Info,
  MapPin,
  PaintRoller,
  Search,
  Sparkles,
  UsersRound,
  Utensils,
  Wrench,
} from 'lucide-react'

type Category = 'Semua' | 'rewang' | 'tukang' | 'IRT' | 'baby sitter' | 'sopir'

const categories: { label: Exclude<Category, 'Semua'>; icon: typeof UsersRound }[] = [
  { label: 'rewang', icon: UsersRound },
  { label: 'tukang', icon: Utensils },
  { label: 'IRT', icon: PaintRoller },
  { label: 'baby sitter', icon: Baby },
  { label: 'sopir', icon: Wrench },
]

const workers = [
  { name: 'Sari W.', role: 'Rewang hajatan', category: 'rewang' as const, area: 'Banjarsari, Solo', price: 'Rp150.000 / hari', initials: 'SW', tone: 'rose' },
  { name: 'Dimas P.', role: 'Tukang bangunan', category: 'tukang' as const, area: 'Laweyan, Solo', price: 'Rp180.000 / hari', initials: 'DP', tone: 'blue' },
  { name: 'Rina A.', role: 'Asisten rumah tangga', category: 'IRT' as const, area: 'Colomadu, Karanganyar', price: 'Rp130.000 / hari', initials: 'RA', tone: 'gold' },
  { name: 'Nadia K.', role: 'Baby sitter', category: 'baby sitter' as const, area: 'Jebres, Solo', price: 'Rp175.000 / hari', initials: 'NK', tone: 'lilac' },
  { name: 'Budi S.', role: 'Sopir keluarga', category: 'sopir' as const, area: 'Kartasura, Sukoharjo', price: 'Rp200.000 / hari', initials: 'BS', tone: 'mint' },
  { name: 'Maya R.', role: 'Rewang hajatan', category: 'rewang' as const, area: 'Grogol, Sukoharjo', price: 'Rp150.000 / hari', initials: 'MR', tone: 'peach' },
]

function BrandMark() {
  return (
    <a className="brand" href="#beranda" aria-label="RewangOS, ke beranda">
      <span className="brand-mark"><Home aria-hidden="true" strokeWidth={2.4} /></span>
      <span className="brand-name">Rewang<span>OS</span></span>
    </a>
  )
}

function Header({ audience, onAudienceChange }: { audience: 'buyer' | 'worker'; onAudienceChange: (value: 'buyer' | 'worker') => void }) {
  return (
    <header className="topbar glass-panel" id="beranda">
      <BrandMark />
      <div className="header-actions">
        <a className="login-button" href="#cari"><CircleUserRound aria-hidden="true" /><span>Masuk</span></a>
      </div>
      <nav className="audience-switch" aria-label="Pilih ruang RewangOS">
        <button className={audience === 'buyer' ? 'audience-option active' : 'audience-option'} onClick={() => onAudienceChange('buyer')} type="button" aria-pressed={audience === 'buyer'}>
          <BriefcaseBusiness aria-hidden="true" /><span>Akun buyer</span>
        </button>
        <button className={audience === 'worker' ? 'audience-option active' : 'audience-option'} onClick={() => onAudienceChange('worker')} type="button" aria-pressed={audience === 'worker'}>
          <HardHat aria-hidden="true" /><span>Ruang worker</span>
        </button>
      </nav>
    </header>
  )
}

function SearchPanel({
  query,
  onQueryChange,
  selectedCategory,
  onCategoryChange,
  onSearch,
}: {
  query: string
  onQueryChange: (value: string) => void
  selectedCategory: Category
  onCategoryChange: (value: Category) => void
  onSearch: (event: React.FormEvent<HTMLFormElement>) => void
}) {
  return (
    <section className="search-panel glass-panel" id="cari" aria-labelledby="search-title">
      <div className="search-title-row">
        <span className="search-title-icon"><Search aria-hidden="true" /></span>
        <h2 id="search-title">Cari nama atau kategori</h2>
      </div>
      <form className="search-form" id="search-form" onSubmit={onSearch} role="search">
        <label className="sr-only" htmlFor="worker-search">Cari nama, pekerjaan, atau kecamatan</label>
        <Search className="input-icon" aria-hidden="true" />
        <input
          id="worker-search"
          name="q"
          value={query}
          onChange={(event) => onQueryChange(event.target.value)}
          placeholder="Misal: tukang, IRT, rewang"
          autoComplete="off"
        />
        <button className="search-arrow" type="submit" aria-label="Cari pekerja"><ArrowRight aria-hidden="true" /></button>
      </form>
      <button className="primary-search" type="submit" form="search-form" aria-label="Cari pekerja">
        <BriefcaseBusiness aria-hidden="true" />
        <span>Cari Pekerja</span>
        <ArrowRight className="primary-search-arrow" aria-hidden="true" />
      </button>
      <div className="category-list" aria-label="Pilih kategori pekerjaan">
        {categories.map(({ label, icon: Icon }) => (
          <button
            className={`category-chip ${selectedCategory === label ? 'selected' : ''}`}
            key={label}
            type="button"
            onClick={() => onCategoryChange(selectedCategory === label ? 'Semua' : label)}
            aria-pressed={selectedCategory === label}
          >
            <span className="category-icon"><Icon aria-hidden="true" /></span>
            <span>#{label}</span>
          </button>
        ))}
      </div>
      <p className="panel-footnote"><Sparkles aria-hidden="true" /> Pilih kategori untuk menemukan pekerja di sekitar Solo Raya.</p>
    </section>
  )
}

function WorkerResults({ category, query }: { category: Category; query: string }) {
  const filteredWorkers = useMemo(() => {
    const normalizedQuery = query.trim().toLowerCase()
    return workers.filter((worker) => {
      const matchesCategory = category === 'Semua' || worker.category === category
      const searchable = `${worker.name} ${worker.role} ${worker.category} ${worker.area}`.toLowerCase()
      return matchesCategory && (!normalizedQuery || searchable.includes(normalizedQuery))
    })
  }, [category, query])

  if (!query.trim() && category === 'Semua') return null

  return (
    <section className="results-section" aria-live="polite" aria-label="Hasil pencarian pekerja">
      <div className="results-heading">
        <div>
          <p className="eyebrow">HASIL PENCARIAN</p>
          <h2>{filteredWorkers.length ? `${filteredWorkers.length} profil ditemukan` : 'Belum ada profil yang cocok'}</h2>
        </div>
        <span className="demo-label"><Info aria-hidden="true" /> Contoh profil</span>
      </div>
      {filteredWorkers.length ? (
        <div className="worker-grid">
          {filteredWorkers.map((worker) => (
            <article className="worker-card glass-panel" key={worker.name}>
              <div className={`worker-avatar ${worker.tone}`} aria-hidden="true">{worker.initials}</div>
              <div className="worker-info">
                <h3>{worker.name}</h3>
                <p>{worker.role}</p>
                <span className="worker-location"><MapPin aria-hidden="true" /> {worker.area}</span>
              </div>
              <div className="worker-price"><strong>{worker.price}</strong><span><Check aria-hidden="true" /> Profil contoh</span></div>
            </article>
          ))}
        </div>
      ) : (
        <div className="empty-results glass-panel">
          <Search aria-hidden="true" />
          <p>Coba kata kunci lain, atau pilih kategori pekerjaan yang berbeda.</p>
        </div>
      )}
    </section>
  )
}

export default function RewangHome() {
  const [audience, setAudience] = useState<'buyer' | 'worker'>('buyer')
  const [query, setQuery] = useState('')
  const [selectedCategory, setSelectedCategory] = useState<Category>('Semua')
  const [hasSearched, setHasSearched] = useState(false)

  const handleSearch = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    setHasSearched(true)
  }

  const handleCategoryChange = (category: Category) => {
    setSelectedCategory(category)
    if (category !== 'Semua') setHasSearched(true)
  }

  return (
    <main className="rewang-page">
      <div className="ambient ambient-one" aria-hidden="true" />
      <div className="ambient ambient-two" aria-hidden="true" />
      <div className="page-shell">
        <Header audience={audience} onAudienceChange={setAudience} />
        <section className="hero" aria-labelledby="hero-title">
          <div className="hero-art" aria-hidden="true">
            <img src="/solo-pavilion.png" alt="" />
            <div className="hero-art-wash" />
            <span className="art-caption"><MapPin aria-hidden="true" /> Surakarta, Jawa Tengah</span>
          </div>
          <div className="hero-copy">
            <p className="location-kicker"><span className="location-dot" /> DIREKTORI PEKERJA LOKAL · SOLO RAYA</p>
            <h1 id="hero-title">Temukan<br /><em>Rewangmu.</em></h1>
            <p className="hero-description">Rewang hajatan, ART, tukang, sopir, sampai baby sitter dari Solo Raya. Lihat tarif harian dan kecamatan sebelum membuka kontak.</p>
            <span className="hero-swish" aria-hidden="true" />
          </div>
        </section>
        <SearchPanel
          query={query}
          onQueryChange={setQuery}
          selectedCategory={selectedCategory}
          onCategoryChange={handleCategoryChange}
          onSearch={handleSearch}
        />
        <aside className="availability glass-panel" aria-label="Ketersediaan pekerja">
          <span className="availability-icon"><Info aria-hidden="true" /></span>
          <p><strong>10</strong> pekerja tersedia menurut data profil.</p>
          <span className="availability-note">Solo Raya <span>•</span> 2026</span>
        </aside>
        {(hasSearched || selectedCategory !== 'Semua') && <WorkerResults category={selectedCategory} query={query} />}
        <footer className="site-footer">
          <span>RewangOS</span>
          <span>Nggawe luwih gampang, bebarengan.</span>
        </footer>
      </div>
    </main>
  )
}
