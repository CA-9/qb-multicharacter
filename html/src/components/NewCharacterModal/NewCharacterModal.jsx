import { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import { ChevronDownIcon, CalendarIcon } from '../Icons'
import './NewCharacterModal.css'

const formatDateInput = (value) => {
  const digits = value.replace(/\D/g, '').slice(0, 8)
  if (digits.length > 4) {
    return `${digits.slice(0, 2)}/${digits.slice(2, 4)}/${digits.slice(4)}`
  }
  if (digits.length > 2) {
    return `${digits.slice(0, 2)}/${digits.slice(2)}`
  }
  return digits
}

const parseDate = (value) => {
  const match = /^(\d{2})\/(\d{2})\/(\d{4})$/.exec(value)
  if (!match) return null
  const month = Number(match[1])
  const day = Number(match[2])
  const year = Number(match[3])
  if (month < 1 || month > 12 || day < 1 || day > 31) return null
  const date = new Date(year, month - 1, day)
  if (
    date.getFullYear() !== year ||
    date.getMonth() !== month - 1 ||
    date.getDate() !== day
  ) {
    return null
  }
  return date
}

const toISODate = (date) => {
  const mm = String(date.getMonth() + 1).padStart(2, '0')
  const dd = String(date.getDate()).padStart(2, '0')
  return `${date.getFullYear()}-${mm}-${dd}`
}

export default function NewCharacterModal({ open, countries, customNationality, onCancel, onCreate }) {
  const [firstname, setFirstname] = useState('')
  const [lastname, setLastname] = useState('')
  const [nationality, setNationality] = useState(countries[0] || 'Afghanistan')
  const [gender, setGender] = useState('Male')
  const [dob, setDob] = useState('')
  const [errors, setErrors] = useState({})
  const [menuOpen, setMenuOpen] = useState(false)
  const firstnameRef = useRef(null)
  const menuRef = useRef(null)

  useEffect(() => {
    if (open) {
      setFirstname('')
      setLastname('')
      setNationality(countries[0] || 'Afghanistan')
      setGender('Male')
      setDob('')
      setErrors({})
      setMenuOpen(false)
      requestAnimationFrame(() => firstnameRef.current && firstnameRef.current.focus())
    }
  }, [open, countries])

  useEffect(() => {
    if (!open) return undefined
    const handleKey = (event) => {
      if (event.key === 'Escape') onCancel()
    }
    window.addEventListener('keydown', handleKey)
    return () => window.removeEventListener('keydown', handleKey)
  }, [open, onCancel])

  useEffect(() => {
    if (!menuOpen) return undefined
    const handleClick = (event) => {
      if (menuRef.current && !menuRef.current.contains(event.target)) {
        setMenuOpen(false)
      }
    }
    window.addEventListener('mousedown', handleClick)
    return () => window.removeEventListener('mousedown', handleClick)
  }, [menuOpen])

  const validate = useCallback(() => {
    const next = {}
    const nameRe = /^[A-Za-zÀ-ÿ' -]{2,32}$/

    if (!firstname.trim() || !nameRe.test(firstname.trim())) {
      next.firstname = 'Please enter a valid first name'
    }
    if (!lastname.trim() || !nameRe.test(lastname.trim())) {
      next.lastname = 'Please enter a valid last name'
    }
    if (!customNationality && !nationality.trim()) {
      next.nationality = 'Please select a nationality'
    }
    if (customNationality && !nationality.trim()) {
      next.nationality = 'Please enter a nationality'
    }

    const date = parseDate(dob)
    if (!dob || !date) {
      next.dob = 'Enter a valid date (MM/DD/YYYY)'
    } else if (date.getTime() >= Date.now()) {
      next.dob = 'Date of birth cannot be in the future'
    }

    setErrors(next)
    return Object.keys(next).length === 0
  }, [firstname, lastname, nationality, dob, customNationality])

  if (!open) return null

  const handleCreate = () => {
    if (!validate()) return
    const date = parseDate(dob)
    onCreate({
      firstname: firstname.trim(),
      lastname: lastname.trim(),
      nationality: nationality.trim(),
      gender,
      birthdate: date ? toISODate(date) : '',
      dob: date ? toISODate(date) : '',
    })
  }

  return (
    <div className="modal-backdrop" onMouseDown={onCancel}>
      <div className="modal" onMouseDown={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <div className="header-accent" />
          <h2 className="modal-title">NEW CHARACTER</h2>
        </div>

        <div className="modal-body">
          <div className="form-row">
            <div className={`form-field ${errors.firstname ? 'has-error' : ''}`}>
              <label htmlFor="mt-firstname">FIRST NAME</label>
              <input
                id="mt-firstname"
                ref={firstnameRef}
                className="form-input"
                type="text"
                maxLength={32}
                value={firstname}
                placeholder="John"
                onChange={(e) => setFirstname(e.target.value)}
              />
              {errors.firstname && <span className="field-error">{errors.firstname}</span>}
            </div>
            <div className={`form-field ${errors.lastname ? 'has-error' : ''}`}>
              <label htmlFor="mt-lastname">LAST NAME</label>
              <input
                id="mt-lastname"
                className="form-input"
                type="text"
                maxLength={32}
                value={lastname}
                placeholder="Doe"
                onChange={(e) => setLastname(e.target.value)}
              />
              {errors.lastname && <span className="field-error">{errors.lastname}</span>}
            </div>
          </div>

          <div className="form-row">
            <div className={`form-field ${errors.nationality ? 'has-error' : ''}`} ref={menuRef}>
              <label htmlFor="mt-nationality">NATIONALITY</label>
              {customNationality ? (
                <input
                  id="mt-nationality"
                  className="form-input"
                  type="text"
                  maxLength={40}
                  value={nationality}
                  onChange={(e) => setNationality(e.target.value)}
                />
              ) : (
                <div className="select-box">
                  <button
                    id="mt-nationality"
                    type="button"
                    className="select-trigger"
                    onClick={() => setMenuOpen((v) => !v)}
                  >
                    <span className="select-value">{nationality || 'Select'}</span>
                    <ChevronDownIcon className={`select-chevron ${menuOpen ? 'open' : ''}`} />
                  </button>
                  {menuOpen && (
                    <div className="select-menu">
                      {countries.map((country) => (
                        <div
                          key={country}
                          className={`select-option ${country === nationality ? 'selected' : ''}`}
                          onClick={() => {
                            setNationality(country)
                            setMenuOpen(false)
                          }}
                        >
                          {country}
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              )}
              {errors.nationality && <span className="field-error">{errors.nationality}</span>}
            </div>

            <div className="form-field">
              <label>GENDER</label>
              <div className="segment">
                <button
                  type="button"
                  className={gender === 'Male' ? 'active' : ''}
                  onClick={() => setGender('Male')}
                >
                  MALE
                </button>
                <button
                  type="button"
                  className={gender === 'Female' ? 'active' : ''}
                  onClick={() => setGender('Female')}
                >
                  FEMALE
                </button>
              </div>
            </div>
          </div>

          <div className="form-row">
            <div className={`form-field ${errors.dob ? 'has-error' : ''}`}>
              <label htmlFor="mt-dob">DATE OF BIRTH</label>
              <div className="input-with-icon">
                <input
                  id="mt-dob"
                  className="form-input"
                  type="text"
                  maxLength={10}
                  value={dob}
                  placeholder="MM/DD/YYYY"
                  onChange={(e) => setDob(formatDateInput(e.target.value))}
                />
                <CalendarIcon className="input-icon" />
              </div>
              {errors.dob && <span className="field-error">{errors.dob}</span>}
            </div>
          </div>
        </div>

        <div className="modal-footer">
          <button type="button" className="cancel-btn" onClick={onCancel}>
            CANCEL
          </button>
          <button type="button" className="create-btn" onClick={handleCreate}>
            CREATE
          </button>
        </div>
      </div>
    </div>
  )
}
