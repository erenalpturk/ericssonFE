import { useEffect, useMemo, useState } from 'react'
import { supabase } from '../services/supabase'
import { useAuth } from '../contexts/AuthContext'

// Basit reklam gösterimi: modal veya banner
function Advertisement() {
  const { user } = useAuth()
  const [ad, setAd] = useState(null)
  const [isOpen, setIsOpen] = useState(false)

  const userKey = useMemo(() => {
    if (!user) return 'anonymous'
    // Uygulamanızdaki benzersiz kullanıcı kimliği: sicil_no mevcut, id de var
    return user.sicil_no || user.id || 'anonymous'
  }, [user])

  const getDismissKey = (adId, frequency, scopeUser) => {
    const base = `ad_dismissed_${adId}`
    if (frequency === 'once_per_user') return `${base}_user_${scopeUser}`
    if (frequency === 'once_per_session') return `${base}_session`
    return `${base}_always` // 'always' gösterimde depolama gerekmez ama anahtar tutarlı kalsın
  }

  useEffect(() => {
    let mounted = true

    const fetchAd = async () => {
      const { data, error } = await supabase
        .from('advertisements')
        .select('*')
        .eq('is_active', true)
        .order('priority', { ascending: false })
        .order('start_at', { ascending: false, nullsFirst: false })
        .limit(1)

      if (error) {
        // eslint-disable-next-line no-console
        console.error('Reklam yüklenemedi:', error)
        return
      }

      const record = (data && data.length > 0) ? data[0] : null
      if (!mounted) return
      if (!record) return

      // Dismiss kontrolü
      const dismissKey = getDismissKey(record.id, record.frequency, userKey)
      const dismissed = record.frequency === 'once_per_user'
        ? localStorage.getItem(dismissKey)
        : record.frequency === 'once_per_session'
          ? sessionStorage.getItem(dismissKey)
          : null

      if (!dismissed) {
        setAd(record)
        setIsOpen(true)
      }
    }

    fetchAd()
    return () => { mounted = false }
  }, [userKey])

  if (!ad || !isOpen) return null

  const handleClose = () => {
    if (ad.dismissible) {
      const dismissKey = getDismissKey(ad.id, ad.frequency, userKey)
      if (ad.frequency === 'once_per_user') {
        localStorage.setItem(dismissKey, '1')
      } else if (ad.frequency === 'once_per_session') {
        sessionStorage.setItem(dismissKey, '1')
      }
      setIsOpen(false)
    }
  }

  const ctaClick = () => {
    if (ad.cta_url) {
      try {
        window.open(ad.cta_url, '_blank', 'noopener,noreferrer')
      // eslint-disable-next-line no-empty
      } catch {}
    }
  }

  if (ad.display_type === 'banner') {
    return (
      <div style={{
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        zIndex: 1050,
        display: 'flex',
        alignItems: 'center',
        gap: '12px',
        padding: '12px 16px',
        background: '#0f172a',
        color: 'white',
        boxShadow: '0 2px 10px rgba(0,0,0,0.2)'
      }}>
        <div style={{ flex: 1 }}>
          <div style={{ fontWeight: 700, marginBottom: 4 }}>{ad.title}</div>
          <div style={{ opacity: 0.9, fontSize: 14 }}>{ad.body}</div>
        </div>
        {ad.cta_text && (
          <button onClick={ctaClick} style={{
            border: 0,
            padding: '8px 12px',
            borderRadius: 8,
            fontWeight: 600,
            cursor: 'pointer',
            background: '#22c55e',
            color: 'white'
          }}>{ad.cta_text}</button>
        )}
        {ad.dismissible && (
          <button onClick={handleClose} style={{
            marginLeft: 8,
            border: '1px solid rgba(255,255,255,0.3)',
            padding: '8px 10px',
            borderRadius: 8,
            fontWeight: 600,
            cursor: 'pointer',
            background: 'transparent',
            color: 'white'
          }}>Kapat</button>
        )}
      </div>
    )
  }

  // Modal görünümü
  return (
    <div style={{
      position: 'fixed',
      inset: 0,
      background: 'rgba(0,0,0,0.5)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      zIndex: 1050
    }}>
      <div style={{
        width: 'min(92vw, 560px)',
        borderRadius: 16,
        background: 'white',
        boxShadow: '0 20px 60px rgba(0,0,0,0.3)'
      }}>
        <div style={{ padding: 20, borderBottom: '1px solid #eee', display: 'flex', alignItems: 'center' }}>
          <div style={{ fontSize: 18, fontWeight: 800, color: '#111827' }}>{ad.title}</div>
        </div>
        {ad.image_url && (
          <div
            style={{
              maxHeight: '60vh',
              overflow: 'hidden',
              background: '#f8fafc',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              padding: 12
            }}
          >
            <img
              src={ad.image_url}
              alt={ad.title}
              style={{
                maxWidth: '100%',
                maxHeight: '60vh',
                width: 'auto',
                height: 'auto',
                objectFit: 'contain',
                display: 'block'
              }}
            />
          </div>
        )}
        <div style={{ padding: 20, color: '#111827', lineHeight: 1.6 }}>{ad.body}</div>
        <div style={{ padding: 20, display: 'flex', gap: 12, justifyContent: 'flex-end', borderTop: '1px solid #eee' }}>
          {ad.cta_text && (
            <button onClick={ctaClick} style={{
              border: 0,
              padding: '10px 14px',
              borderRadius: 10,
              fontWeight: 700,
              cursor: 'pointer',
              background: '#2563eb',
              color: 'white'
            }}>{ad.cta_text}</button>
          )}
          {ad.dismissible && (
            <button onClick={handleClose} style={{
              border: '1px solid #e5e7eb',
              padding: '10px 14px',
              borderRadius: 10,
              fontWeight: 700,
              cursor: 'pointer',
              background: 'white',
              color: '#111827'
            }}>Kapat</button>
          )}
        </div>
      </div>
    </div>
  )
}

export default Advertisement

