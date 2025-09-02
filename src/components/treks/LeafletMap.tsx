'use client'

import dynamic from 'next/dynamic'
import { useEffect, useState } from 'react'
import { supabase } from '../../lib/supabaseClient'

const MapContainer = dynamic(() => import('react-leaflet').then(m => m.MapContainer), { ssr: false })
const TileLayer = dynamic(() => import('react-leaflet').then(m => m.TileLayer), { ssr: false })
const Marker = dynamic(() => import('react-leaflet').then(m => m.Marker), { ssr: false })
const Popup = dynamic(() => import('react-leaflet').then(m => m.Popup), { ssr: false })

export default function LeafletMap({ trekId }: { trekId: string }) {
  const [coords, setCoords] = useState<[number, number] | null>([27.9881, 86.9250]) // Mount Everest


  useEffect(() => {
    const fetchCoords = async () => {
      const { data, error } = await supabase
        .from('treks')
        .select('latitude, longitude')
        .eq('id', trekId)
        .single()

      if (error) {
        console.error('Error fetching trek coords:', error)
      } else {
        console.log('Fetched trek coords:', data) // 👀 Debug log
        if (data && data.latitude && data.longitude) {
          setCoords([data.latitude, data.longitude])
        } else {
          console.warn('No coords found for trekId:', trekId)
        }
      }
    }

    if (trekId) fetchCoords()
  }, [trekId])

  if (!coords) return <p>Loading -- map...</p>

  return (
    <MapContainer center={coords} zoom={13} style={{ height: '400px', width: '100%' }}>
      <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
      <Marker position={coords}>
        <Popup>Trek Location</Popup>
      </Marker>
    </MapContainer>
  )
}
