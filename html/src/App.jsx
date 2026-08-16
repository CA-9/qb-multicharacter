import { useCallback, useEffect, useState } from 'react'
import { useNuiEvent } from './hooks/useNuiEvent'
import { fetchNui } from './lib/fetchNui'
import CharacterSelect from './views/CharacterSelect/CharacterSelect'
import fallbackCountries from './data/countries'

const defaultConfig = {
  nChar: 5,
  enableDeleteButton: true,
  customNationality: false,
  lockedCharacters: {},
  countries: fallbackCountries,
}

const isPreview =
  typeof window !== 'undefined' &&
  Boolean(new URLSearchParams(window.location.search).has('preview'))

const mockCharacters = [
  {
    citizenid: 'AAA11111',
    cid: 0,
    charinfo: {
      firstname: 'John',
      lastname: 'Doe',
      birthdate: '1998-05-14',
      nationality: 'United States of America',
      gender: 0,
    },
    money: { cash: 500, bank: 5000 },
    job: { label: 'Unemployed' },
  },
  {
    citizenid: 'BBB22222',
    cid: 2,
    charinfo: {
      firstname: 'Jane',
      lastname: 'Smith',
      birthdate: '2001-11-02',
      nationality: 'Canada',
      gender: 1,
    },
    money: { cash: 1200, bank: 15000 },
    job: { label: 'Police Officer' },
  },
]

export default function App() {
  const [visible, setVisible] = useState(false)
  const [loading, setLoading] = useState(false)
  const [characters, setCharacters] = useState({})
  const [config, setConfig] = useState(defaultConfig)

  useEffect(() => {
    if (!isPreview) return
    const map = {}
    mockCharacters.forEach((c) => {
      map[c.cid] = c
    })
    setConfig({
      ...defaultConfig,
      lockedCharacters: { BBB22222: true },
    })
    setCharacters(map)
    setVisible(true)
    setLoading(false)
  }, [])

  useNuiEvent('ui', (data) => {
    setConfig({
      nChar: data.nChar ?? defaultConfig.nChar,
      enableDeleteButton: data.enableDeleteButton ?? defaultConfig.enableDeleteButton,
      customNationality: data.customNationality ?? defaultConfig.customNationality,
      lockedCharacters: data.lockedCharacters || {},
      countries: Array.isArray(data.countries) && data.countries.length ? data.countries : fallbackCountries,
    })
    if (data.toggle) {
      setVisible(true)
      setLoading(true)
      fetchNui('setupCharacters')
      window.setTimeout(() => setLoading(false), 2500)
    } else {
      setVisible(false)
    }
  })

  useNuiEvent('setupCharacters', (data) => {
    const map = {}
    ;(data.characters || []).forEach((c) => {
      map[c.cid] = c
    })
    setCharacters(map)
    setLoading(false)
    fetchNui('removeBlur')
  })

  const handleSlotChange = useCallback((slotId, cData) => {
    fetchNui('selectSlot', { slotId, cData: cData || null })
  }, [])

  const handlePlay = useCallback((cData) => {
    fetchNui('selectCharacter', { cData })
  }, [])

  const handleCreate = useCallback((payload) => {
    fetchNui('createCharacter', payload)
  }, [])

  const handleDelete = useCallback((character) => {
    fetchNui('removeCharacter', { citizenid: character.citizenid })
  }, [])

  const handleCloseModal = useCallback(() => {
    fetchNui('closeModal')
  }, [])

  if (!visible) return null

  return (
    <div className="mt-app">
      {isPreview && (
        <div className="mt-preview-badge">
          UI PREVIEW — mock data, no FiveM
        </div>
      )}
      {loading && (
        <div className="mt-loading">
          <div className="mt-spinner" />
          <span>RETRIEVING CHARACTERS</span>
        </div>
      )}
      <CharacterSelect
        characters={characters}
        maxChars={config.nChar}
        countries={config.countries}
        customNationality={config.customNationality}
        enableDeleteButton={config.enableDeleteButton}
        lockedCharacters={config.lockedCharacters}
        onSlotChange={handleSlotChange}
        onPlay={handlePlay}
        onCreate={handleCreate}
        onDelete={handleDelete}
        onCloseModal={handleCloseModal}
      />
    </div>
  )
}
