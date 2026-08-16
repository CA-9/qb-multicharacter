import { useEffect, useMemo, useRef, useState } from 'react'
import NewCharacterModal from '../../components/NewCharacterModal/NewCharacterModal'
import { UserIcon, PlusIcon, LockIcon } from '../../components/Icons'
import './CharacterSelect.css'

const formatBirthdate = (birthdate) => {
  if (!birthdate) return ''
  const iso = /^(\d{4})-(\d{2})-(\d{2})/.exec(birthdate)
  if (iso) return `${iso[2]}/${iso[3]}/${iso[1]}`
  const mmddyyyy = /^(\d{2})\/(\d{2})\/(\d{4})/.exec(birthdate)
  if (mmddyyyy) return birthdate
  return birthdate
}

export default function CharacterSelect({
  characters,
  maxChars,
  countries,
  customNationality,
  enableDeleteButton,
  lockedCharacters,
  onSlotChange,
  onPlay,
  onCreate,
  onDelete,
  onCloseModal,
}) {
  const [slotIndex, setSlotIndex] = useState(0)
  const [modalOpen, setModalOpen] = useState(false)
  const [confirmDelete, setConfirmDelete] = useState(false)
  const lastSent = useRef({ slot: -1, cid: null })

  const slots = useMemo(() => {
    const arr = []
    for (let i = 0; i < maxChars; i++) arr.push(characters[i] || null)
    return arr
  }, [characters, maxChars])

  const current = slots[slotIndex] || null
  const isNewSlot = !current

  const filledSlots = useMemo(() => slots.map((s, i) => (s ? i : -1)).filter((i) => i >= 0), [slots])
  const emptySlots = useMemo(() => slots.map((s, i) => (s ? -1 : i)).filter((i) => i >= 0), [slots])

  useEffect(() => {
    const cid = current ? current.citizenid : null
    if (lastSent.current.slot !== slotIndex || lastSent.current.cid !== cid) {
      lastSent.current = { slot: slotIndex, cid }
      onSlotChange(slotIndex, current || null)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [slotIndex, current])

  useEffect(() => {
    const handleKey = (event) => {
      if (modalOpen) return
      if (event.key === 'ArrowRight') {
        setSlotIndex((i) => (i + 1) % maxChars)
      } else if (event.key === 'ArrowLeft') {
        setSlotIndex((i) => (i - 1 + maxChars) % maxChars)
      } else if (event.key === 'Enter') {
        event.preventDefault()
        handlePrimaryAction()
      }
    }
    window.addEventListener('keydown', handleKey)
    return () => window.removeEventListener('keydown', handleKey)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [modalOpen, maxChars, current, isNewSlot])

  const jumpToNextFilled = () => {
    if (filledSlots.length === 0) return
    const next = filledSlots.find((i) => i > slotIndex)
    setSlotIndex(next !== undefined ? next : filledSlots[0])
  }

  const jumpToNextEmpty = () => {
    if (emptySlots.length === 0) return
    const next = emptySlots.find((i) => i > slotIndex)
    setSlotIndex(next !== undefined ? next : emptySlots[0])
  }

  const handlePrimaryAction = () => {
    if (isNewSlot) {
      setModalOpen(true)
    } else if (current) {
      onPlay(current)
    }
  }

  const handleDelete = () => {
    if (!current) return
    if (!confirmDelete) {
      setConfirmDelete(true)
      setTimeout(() => setConfirmDelete(false), 3000)
      return
    }
    setConfirmDelete(false)
    onDelete(current)
  }

  const isLocked = current ? (lockedCharacters && lockedCharacters[current.citizenid]) === true : false

  const subtitle = isNewSlot ? 'EMPTY SLOT' : `CHARACTER ${String(slotIndex + 1).padStart(2, '0')}`
  const title = isNewSlot ? 'CREATE A CHARACTER' : `${current.charinfo?.firstname || 'Unknown'} ${current.charinfo?.lastname || ''}`.toUpperCase()
  const subtext = isNewSlot
    ? 'START A NEW LIFE IN LOS SANTOS'
    : [
        current.charinfo?.gender === 1 ? 'FEMALE' : current.charinfo?.gender === 0 ? 'MALE' : current.charinfo?.gender ? String(current.charinfo.gender).toUpperCase() : '',
        current.charinfo?.nationality ? String(current.charinfo.nationality).toUpperCase() : '',
        current.charinfo?.birthdate ? formatBirthdate(current.charinfo.birthdate) : '',
      ]
        .filter(Boolean)
        .join('  •  ')

  return (
    <div className="character-select">
      <div className="select-header">
        <p className="select-subtitle">{subtitle}</p>
        <h1 className="select-title">{title}</h1>
        <p className="select-subtext">{subtext}</p>
      </div>

      {enableDeleteButton && !isNewSlot && (
        <button
          type="button"
          className={`delete-btn ${confirmDelete ? 'confirming' : ''} ${isLocked ? 'locked' : ''}`}
          onClick={handleDelete}
          disabled={isLocked}
        >
          {isLocked ? (
            <>
              <LockIcon /> LOCKED
            </>
          ) : confirmDelete ? (
            'CONFIRM?'
          ) : (
            'DELETE'
          )}
        </button>
      )}

      <div className="slot-nav">
        <div className="nav-buttons">
          <button
            type="button"
            className={`slot-btn ${!isNewSlot ? 'active' : ''}`}
            title="Existing characters"
            onClick={jumpToNextFilled}
          >
            <UserIcon size={22} />
          </button>
          <button
            type="button"
            className={`slot-btn ${isNewSlot ? 'active' : ''}`}
            title="New character"
            onClick={jumpToNextEmpty}
          >
            <PlusIcon size={22} />
          </button>
        </div>
        <div className={`slot-indicator ${isNewSlot ? 'visible' : 'hidden'}`}>
          <span className="indicator-label">{isNewSlot ? 'NEW' : 'CHARACTER'}</span>
          <span className="indicator-bar" />
        </div>
      </div>

      <button type="button" className="create-btn" onClick={handlePrimaryAction}>
        {isNewSlot ? 'CREATE' : 'PLAY'}
      </button>

      <NewCharacterModal
        open={modalOpen}
        countries={countries}
        customNationality={customNationality}
        onCancel={() => {
          setModalOpen(false)
          onCloseModal()
        }}
        onCreate={(payload) => {
          setModalOpen(false)
          onCreate({ ...payload, cid: slotIndex })
        }}
      />
    </div>
  )
}
