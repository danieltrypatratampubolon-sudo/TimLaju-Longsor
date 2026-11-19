import { useEffect, useState } from 'react'
import { CircleMarker, GeoJSON, ImageOverlay, MapContainer, Pane, TileLayer, Tooltip, ZoomControl, useMap } from 'react-leaflet'
import 'leaflet/dist/leaflet.css'
import './App.css'
import trainingPoints from './trainingPoints.json'

const assetUrl = (path) => `${import.meta.env.BASE_URL}${path}`

const pointNumberByClassAndDistrict = new Map()
const locations = trainingPoints.map((point) => {
  const isEvent = point.class === 1
  const districtKey = `${point.class}-${point.kecamatan}`
  const number = (pointNumberByClassAndDistrict.get(districtKey) || 0) + 1
  pointNumberByClassAndDistrict.set(districtKey, number)
  const category = isEvent ? 'Titik kejadian longsor' : 'Titik non-kejadian'

  return {
    ...point,
    name: isEvent
      ? `Kejadian longsor (2024-2025) - ${point.kecamatan} (${number})`
      : `Non-kejadian - ${point.kecamatan} (${number})`,
    category,
    status: category,
  }
})

function ThematicLineLayer({ data, category, color, width, opacity = 1 }) {
  const filter = (feature) => feature.properties.jenis === category

  return (
    <>
      <GeoJSON
        data={data}
        filter={filter}
        style={() => ({
          color: '#293b31',
          weight: width + 1.5,
          opacity: opacity * 0.55,
          lineCap: 'round',
          lineJoin: 'round',
        })}
      />
      <GeoJSON
        data={data}
        filter={filter}
        style={() => ({
          color,
          weight: width,
          opacity,
          lineCap: 'round',
          lineJoin: 'round',
        })}
        onEachFeature={(feature, layer) => {
          layer.bindTooltip(
            feature.properties.nama
              ? `${feature.properties.nama} - ${feature.properties.jenis}`
              : feature.properties.jenis,
            { sticky: true }
          )
        }}
      />
    </>
  )
}

function AdministrativeBoundaryLayer({ areaData, lineData }) {
  return (
    <>
      {areaData && (
        <GeoJSON
          data={areaData}
          style={() => ({
            color: '#39824e',
            weight: 1.1,
            opacity: 0.9,
            fillColor: '#67aa72',
            fillOpacity: 0.18,
          })}
        />
      )}
      {lineData && (
        <>
          <GeoJSON
            data={lineData}
            style={() => ({
              color: '#f2d18e',
              weight: 3.5,
              opacity: 0.95,
              fill: false,
            })}
          />
          <GeoJSON
            data={lineData}
            style={() => ({
              color: '#294234',
              weight: 1.2,
              opacity: 0.95,
              fill: false,
            })}
            onEachFeature={(feature, layer) => {
              layer.bindTooltip(feature.properties.kecamatan, { sticky: true })
            }}
          />
        </>
      )}
    </>
  )
}

function MapController({ selected, searchKey, boundaryData }) {
  const map = useMap()

  useEffect(() => {
    if (selected) map.flyTo([selected.lat, selected.lng], 16, { duration: 0.8 })
  }, [map, selected])

  useEffect(() => {
    if (searchKey === 'show-all' && boundaryData) {
      const [west, south, east, north] = boundaryData.bbox
      map.flyToBounds([[south, west], [north, east]], { duration: 0.8, padding: [30, 30] })
    }
  }, [map, searchKey, boundaryData])

  useEffect(() => {
    if (boundaryData) {
      const [west, south, east, north] = boundaryData.bbox
      map.fitBounds([[south, west], [north, east]], { padding: [30, 30] })
    }
  }, [map, boundaryData])

  return null
}

function LayerPanel({
  boundaryData,
  showBoundaryLayer,
  setShowBoundaryLayer,
  showElevationLayer,
  setShowElevationLayer,
  showSchoolLayer,
  setShowSchoolLayer,
  showArterialLayer,
  setShowArterialLayer,
  showCollectorLayer,
  setShowCollectorLayer,
  showLocalLayer,
  setShowLocalLayer,
  showEventLayer,
  setShowEventLayer,
  showNonEventLayer,
  setShowNonEventLayer,
  schoolCount,
  arterialCount,
  collectorCount,
  localCount,
  eventCount,
  nonEventCount,
}) {
  return (
    <section className="layer-panel">
      <h2>Legenda dan layer</h2>
      <label className="check-row">
        <input type="checkbox" checked={showBoundaryLayer} onChange={(event) => setShowBoundaryLayer(event.target.checked)} />
        <span className="layer-swatch boundary-swatch" aria-hidden="true" />
        <span>Batas kecamatan</span>
        <strong>{boundaryData?.features.length ?? 17}</strong>
      </label>
      <label className="check-row elevation-layer">
        <input type="checkbox" checked={showElevationLayer} onChange={(event) => setShowElevationLayer(event.target.checked)} />
        <span className="layer-swatch elevation-swatch" aria-hidden="true" />
        <span>Elevasi</span>
        <strong>103-2.436</strong>
      </label>
      <div className="elevation-legend" aria-label="Legenda elevasi, minimum 103 dan maksimum 2436">
        <div className="elevation-gradient" />
        <div className="elevation-range">
          <span>Min 103</span>
          <span>Max 2.436</span>
        </div>
      </div>
      <label className="check-row school-layer">
        <input type="checkbox" checked={showSchoolLayer} onChange={(event) => setShowSchoolLayer(event.target.checked)} />
        <span className="layer-swatch school-swatch" aria-hidden="true" />
        <span>Sekolah dasar</span>
        <strong>{schoolCount || 128}</strong>
      </label>
      <label className="check-row arterial-layer">
        <input type="checkbox" checked={showArterialLayer} onChange={(event) => setShowArterialLayer(event.target.checked)} />
        <span className="layer-swatch arterial-swatch" aria-hidden="true" />
        <span>Jalan arteri</span>
        <strong>{arterialCount}</strong>
      </label>
      <label className="check-row collector-layer">
        <input type="checkbox" checked={showCollectorLayer} onChange={(event) => setShowCollectorLayer(event.target.checked)} />
        <span className="layer-swatch collector-swatch" aria-hidden="true" />
        <span>Jalan kolektor</span>
        <strong>{collectorCount}</strong>
      </label>
      <label className="check-row local-layer">
        <input type="checkbox" checked={showLocalLayer} onChange={(event) => setShowLocalLayer(event.target.checked)} />
        <span className="layer-swatch local-swatch" aria-hidden="true" />
        <span>Jalan lokal</span>
        <strong>{localCount}</strong>
      </label>
      <label className="check-row event-layer">
        <input type="checkbox" checked={showEventLayer} onChange={(event) => setShowEventLayer(event.target.checked)} />
        <span className="layer-swatch event-swatch" aria-hidden="true" />
        <span>Titik kejadian longsor</span>
        <strong>{eventCount}</strong>
      </label>
      <label className="check-row non-event-layer">
        <input type="checkbox" checked={showNonEventLayer} onChange={(event) => setShowNonEventLayer(event.target.checked)} />
        <span className="layer-swatch non-event-swatch" aria-hidden="true" />
        <span>Titik non-kejadian</span>
        <strong>{nonEventCount}</strong>
      </label>
    </section>
  )
}

function App() {
  const [selected, setSelected] = useState(null)
  const [query, setQuery] = useState('')
  const [showEventLayer, setShowEventLayer] = useState(true)
  const [showNonEventLayer, setShowNonEventLayer] = useState(true)
  const [showBoundaryLayer, setShowBoundaryLayer] = useState(true)
  const [showElevationLayer, setShowElevationLayer] = useState(true)
  const [showSchoolLayer, setShowSchoolLayer] = useState(true)
  const [showArterialLayer, setShowArterialLayer] = useState(true)
  const [showCollectorLayer, setShowCollectorLayer] = useState(true)
  const [showLocalLayer, setShowLocalLayer] = useState(true)
  const [showMobileLayers, setShowMobileLayers] = useState(false)
  const [searchMessage, setSearchMessage] = useState('')
  const [searchKey, setSearchKey] = useState('')
  const [boundaryData, setBoundaryData] = useState(null)
  const [boundaryError, setBoundaryError] = useState('')
  const [areaData, setAreaData] = useState(null)
  const [areaError, setAreaError] = useState('')
  const [roadsData, setRoadsData] = useState(null)
  const [roadsError, setRoadsError] = useState('')
  const [schoolLocations, setSchoolLocations] = useState([])
  const [schoolsError, setSchoolsError] = useState('')

  useEffect(() => {
    let cancelled = false

    fetch(assetUrl('data/kecamatanKaroLines.json'))
      .then((response) => {
        if (!response.ok) throw new Error(`HTTP ${response.status}`)
        return response.json()
      })
      .then((data) => {
        if (!cancelled) setBoundaryData(data)
      })
      .catch((error) => {
        if (!cancelled) setBoundaryError(error.message)
      })

    return () => {
      cancelled = true
    }
  }, [])

  useEffect(() => {
    let cancelled = false

    fetch(assetUrl('data/kecamatanKaroPolygons.json'))
      .then((response) => {
        if (!response.ok) throw new Error(`HTTP ${response.status}`)
        return response.json()
      })
      .then((data) => {
        if (!cancelled) setAreaData(data)
      })
      .catch((error) => {
        if (!cancelled) setAreaError(error.message)
      })

    return () => {
      cancelled = true
    }
  }, [])

  useEffect(() => {
    let cancelled = false

    fetch(assetUrl('data/roadsKaro.json'))
      .then((response) => {
        if (!response.ok) throw new Error(`HTTP ${response.status}`)
        return response.json()
      })
      .then((data) => {
        if (!cancelled) setRoadsData(data)
      })
      .catch((error) => {
        if (!cancelled) setRoadsError(error.message)
      })

    return () => {
      cancelled = true
    }
  }, [])

  useEffect(() => {
    let cancelled = false

    fetch(assetUrl('data/sdKaro.json'))
      .then((response) => {
        if (!response.ok) throw new Error(`HTTP ${response.status}`)
        return response.json()
      })
      .then((data) => {
        if (cancelled) return
        setSchoolLocations(data.features.map((feature) => ({
          id: `school-${feature.id}`,
          type: 'school',
          name: feature.properties.nama_sekolah,
          category: 'Sekolah Dasar',
          status: 'Sekolah Dasar',
          lat: feature.geometry.coordinates[1],
          lng: feature.geometry.coordinates[0],
        })))
      })
      .catch((error) => {
        if (!cancelled) setSchoolsError(error.message)
      })

    return () => {
      cancelled = true
    }
  }, [])

  const searchTerm = query.trim().toLowerCase()
  const filteredLocations = [...locations, ...schoolLocations].filter((item) =>
    `${item.name} ${item.category} ${item.status} ${item.class ?? ''} ${item.split ?? ''} ${item.kecamatan ?? ''}`
      .toLowerCase()
      .includes(searchTerm)
  )
  const eventCount = locations.filter((item) => item.class === 1).length
  const nonEventCount = locations.filter((item) => item.class === 0).length
  const arterialCount = roadsData?.features.filter((feature) => feature.properties.jenis === 'Jalan Arteri').length ?? 28
  const collectorCount = roadsData?.features.filter((feature) => feature.properties.jenis === 'Jalan Kolektor').length ?? 10
  const localCount = roadsData?.features.filter((feature) => feature.properties.jenis === 'Jalan Lokal').length ?? 392
  const dataErrors = [
    boundaryError && `Gagal memuat batas kecamatan: ${boundaryError}`,
    areaError && `Gagal memuat area kecamatan: ${areaError}`,
    roadsError && `Gagal memuat data jalan: ${roadsError}`,
    schoolsError && `Gagal memuat titik sekolah dasar: ${schoolsError}`,
  ].filter(Boolean)

  const selectLocation = (item) => {
    setSelected(item)
    setShowMobileLayers(false)
  }

  const handleSearch = () => {
    if (!searchTerm) {
      setSearchMessage('')
      setSelected(null)
      setSearchKey('show-all')
      return
    }
    if (filteredLocations.length === 0) {
      setSearchMessage('Lokasi tidak ditemukan. Coba kata kunci lain.')
      return
    }
    setSearchMessage('')
    selectLocation(filteredLocations[0])
  }

  return (
    <main className="app">
      <aside id="mobile-location-drawer" className={`sidebar ${showMobileLayers ? 'sidebar-open' : ''}`}>
        <header className="brand">
          <img
            className="brand-mark"
            src={assetUrl('logo-laboratorium-sig.png')}
            alt="Logo Laboratorium Sistem Informasi Geografis UNIMED"
          />
          <div>
            <h1>Pemetaan Longsor</h1>
            <p>Kabupaten Karo | Sumatera Utara</p>
          </div>
        </header>

        <section className="search-box">
          <label htmlFor="location-search">Cari titik</label>
          <div className="search-row">
            <input
              id="location-search"
              value={query}
              onChange={(event) => {
                setQuery(event.target.value)
                setSearchMessage('')
              }}
              onKeyDown={(event) => event.key === 'Enter' && handleSearch()}
              placeholder="Cari sekolah / kecamatan"
            />
            <button
              className="search-clear"
              type="button"
              disabled={!query}
              onClick={() => {
                setQuery('')
                setSearchMessage('')
              }}
              aria-label="Hapus pencarian"
              title="Hapus pencarian"
            >
              ×
            </button>
            <button type="button" onClick={handleSearch}>Cari</button>
          </div>
          {searchMessage && <p className="search-feedback" role="status">{searchMessage}</p>}
        </section>

        <LayerPanel
          boundaryData={boundaryData}
          showBoundaryLayer={showBoundaryLayer}
          setShowBoundaryLayer={setShowBoundaryLayer}
          showElevationLayer={showElevationLayer}
          setShowElevationLayer={setShowElevationLayer}
          showSchoolLayer={showSchoolLayer}
          setShowSchoolLayer={setShowSchoolLayer}
          showArterialLayer={showArterialLayer}
          setShowArterialLayer={setShowArterialLayer}
          showCollectorLayer={showCollectorLayer}
          setShowCollectorLayer={setShowCollectorLayer}
          showLocalLayer={showLocalLayer}
          setShowLocalLayer={setShowLocalLayer}
          showEventLayer={showEventLayer}
          setShowEventLayer={setShowEventLayer}
          showNonEventLayer={showNonEventLayer}
          setShowNonEventLayer={setShowNonEventLayer}
          schoolCount={schoolLocations.length}
          arterialCount={arterialCount}
          collectorCount={collectorCount}
          localCount={localCount}
          eventCount={eventCount}
          nonEventCount={nonEventCount}
        />

        <section className="location-list">
          <div className="section-title">
            <h2>Lokasi di peta</h2>
            <span aria-live="polite">{filteredLocations.length} lokasi</span>
          </div>
          {filteredLocations.map((item) => (
            <button
              className={`location-card ${selected?.id === item.id ? 'active' : ''}`}
              key={item.id}
              type="button"
              onClick={() => selectLocation(item)}
            >
              <span className={`location-dot ${item.type === 'school' ? 'school-dot' : item.class === 1 ? 'event-dot' : 'non-event-dot'}`} />
              <span className="location-copy">
                <strong>{item.name}</strong>
                <small>{item.type === 'school' ? 'Sekolah dasar' : `${item.category} - Kecamatan ${item.kecamatan}`}</small>
              </span>
            </button>
          ))}
          {filteredLocations.length === 0 && (
            <p className="empty-list">Tidak ada lokasi yang cocok.</p>
          )}
        </section>
        <footer className="creators">
          <h2>Tim penyusun</h2>
          <ol>
            <li>Daniel Try</li>
            <li>Daffa Afsajulianda</li>
            <li>Cornelius Parlindungan Simbolon</li>
          </ol>
        </footer>
      </aside>

      <section className="map-area">
        {showMobileLayers && (
          <button
            className="mobile-drawer-backdrop"
            type="button"
            aria-label="Tutup pencarian dan daftar lokasi"
            onClick={() => setShowMobileLayers(false)}
          />
        )}
        <button
          className="mobile-layers-toggle"
          type="button"
          aria-expanded={showMobileLayers}
          aria-controls="mobile-location-drawer"
          onClick={() => setShowMobileLayers((isOpen) => !isOpen)}
        >
          {showMobileLayers ? 'Tutup pencarian' : 'Cari lokasi'}
        </button>
        <div className="mobile-legend-panel">
          <LayerPanel
            boundaryData={boundaryData}
            showBoundaryLayer={showBoundaryLayer}
            setShowBoundaryLayer={setShowBoundaryLayer}
            showElevationLayer={showElevationLayer}
            setShowElevationLayer={setShowElevationLayer}
            showSchoolLayer={showSchoolLayer}
            setShowSchoolLayer={setShowSchoolLayer}
            showArterialLayer={showArterialLayer}
            setShowArterialLayer={setShowArterialLayer}
            showCollectorLayer={showCollectorLayer}
            setShowCollectorLayer={setShowCollectorLayer}
            showLocalLayer={showLocalLayer}
            setShowLocalLayer={setShowLocalLayer}
            showEventLayer={showEventLayer}
            setShowEventLayer={setShowEventLayer}
            showNonEventLayer={showNonEventLayer}
            setShowNonEventLayer={setShowNonEventLayer}
            schoolCount={schoolLocations.length}
            arterialCount={arterialCount}
            collectorCount={collectorCount}
            localCount={localCount}
            eventCount={eventCount}
            nonEventCount={nonEventCount}
          />
        </div>
        <header className="map-header">
          <div>
            <p>{selected ? 'Lokasi dipilih' : 'Cakupan peta'}</p>
            <h2>{selected?.name || 'Kabupaten Karo'}</h2>
          </div>
          {selected
            ? <div className="status"><span /> {selected.status}</div>
            : <div className="status">{boundaryData?.features.length ?? 17} kecamatan</div>}
        </header>

        <MapContainer center={[3.08, 98.27]} zoom={9} zoomControl={false} className="map">
          <TileLayer
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          />
          <MapController selected={selected} searchKey={searchKey} boundaryData={boundaryData} />
          <ZoomControl position="topleft" />
          {showElevationLayer && (
            <Pane name="elevationRaster" style={{ zIndex: 350 }}>
              <ImageOverlay
                url={assetUrl('data/elevation-karo.png')}
                bounds={[[2.829693144976493, 97.90378955505017], [3.330953073515186, 98.63052661990287]]}
                opacity={0.58}
                alt="Model elevasi Kabupaten Karo"
              />
            </Pane>
          )}
          {showBoundaryLayer && (
            <AdministrativeBoundaryLayer areaData={areaData} lineData={boundaryData} />
          )}
          {showSchoolLayer && (
            <Pane name="schoolPoints" style={{ zIndex: 620 }}>
              {schoolLocations.map((school) => (
                <CircleMarker
                  key={school.id}
                  center={[school.lat, school.lng]}
                  radius={selected?.id === school.id ? 6 : 4}
                  pathOptions={{
                    color: '#155b4c',
                    fillColor: '#25866d',
                    fillOpacity: 1,
                    opacity: 1,
                    weight: 1,
                  }}
                  eventHandlers={{ click: () => selectLocation(school) }}
                >
                  <Tooltip>{school.name}</Tooltip>
                </CircleMarker>
              ))}
            </Pane>
          )}
          {roadsData && showArterialLayer && (
            <ThematicLineLayer
              data={roadsData}
              category="Jalan Arteri"
              color="#a34db6"
              width={2.5}
              opacity={0.9}
            />
          )}
          {roadsData && showCollectorLayer && (
            <ThematicLineLayer
              data={roadsData}
              category="Jalan Kolektor"
              color="#c68732"
              width={2}
              opacity={0.6}
            />
          )}
          {roadsData && showLocalLayer && (
            <ThematicLineLayer
              data={roadsData}
              category="Jalan Lokal"
              color="#c76d56"
              width={1.5}
              opacity={0.32}
            />
          )}
          <Pane name="classifiedPoints" style={{ zIndex: 625 }}>
            {locations
              .filter((item) => item.class === 1 ? showEventLayer : showNonEventLayer)
              .map((item) => (
                <CircleMarker
                  key={item.id}
                  center={[item.lat, item.lng]}
                  radius={selected?.id === item.id ? 7 : 5}
                  pathOptions={{
                    color: item.class === 1 ? '#8f3028' : '#2c5967',
                    fillColor: item.class === 1 ? '#c7473b' : '#3f788b',
                    fillOpacity: 1,
                    opacity: 1,
                    weight: 1.25,
                  }}
                  eventHandlers={{ click: () => selectLocation(item) }}
                >
                  <Tooltip>
                    <strong>{item.name}</strong><br />{item.category}
                  </Tooltip>
                </CircleMarker>
              ))}
          </Pane>
        </MapContainer>
        {dataErrors.length > 0 && (
          <div className="data-error" role="alert">
            {dataErrors.map((error) => <div key={error}>{error}</div>)}
          </div>
        )}

        {selected && (
          <article className="info-card">
            <button type="button" className="close-info" aria-label="Tutup detail lokasi" onClick={() => setSelected(null)}>x</button>
            <p>{selected.category}</p>
            <h3>{selected.name}</h3>
            <dl>
              {selected.type === 'school'
                ? <div><dt>Jenjang</dt><dd>Sekolah dasar</dd></div>
                : <>
                  <div><dt>Kecamatan</dt><dd>{selected.kecamatan}</dd></div>
                  <div><dt>Klasifikasi</dt><dd>{selected.category}</dd></div>
                  <div><dt>Kelas data</dt><dd>{selected.class}</dd></div>
                </>}
              <div><dt>Koordinat</dt><dd>{selected.lat.toFixed(5)}, {selected.lng.toFixed(5)}</dd></div>
            </dl>
          </article>
        )}
      </section>
    </main>
  )
}

export default App
