Config = {}

-- =====================================================================================
-- CHARACTER SLOTS
-- =====================================================================================

-- Define the maximum amount of characters each player can create by default.
-- Change this number to allow more (or fewer) character slots per player.
Config.DefaultNumberOfCharacters = 3

-- Define the maximum amount of characters for specific players by Rockstar license.
-- You can find a player's license in your server's database (players table, license column).
-- Priority overrides Config.DefaultNumberOfCharacters for matching licenses.
Config.PlayersNumberOfCharacters = {
    -- { license = 'license:xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx', numberOfChars = 2 },
}

-- =====================================================================================
-- LOCKED CHARACTERS
-- =====================================================================================

-- Lock specific characters so they CANNOT be deleted from the multicharacter screen.
-- Add the citizenid of any character you want to protect (e.g. staff/event characters).
-- Locked characters will not show the delete button in the UI and the server will
-- refuse to delete them even if a malicious client tries.
Config.LockedCharacters = {
    -- ['abc12345'] = true,
}

-- =====================================================================================
-- WORLD / CAMERA
-- =====================================================================================

Config.Interior = vector3(-763.2816, 330.0418, 199.4865)              -- Interior to load where characters are previewed
Config.DefaultSpawn = vector3(-1035.71, -2731.87, 12.86)              -- Default spawn coords if you have start apartments disabled
Config.PedCoords = vector4(-763.2816, 330.0418, 199.4865, 177.7942)   -- Create preview ped at these coordinates
Config.HiddenCoords = vector4(-779.0154, 326.1801, 196.0860, 91.0454) -- Hides your actual ped while you are in selection
Config.CamCoords = vector4(-763.1219, 326.8112, 200, 357.0954)        -- Camera coordinates for character preview screen

-- =====================================================================================
-- MISC
-- =====================================================================================

Config.EnableDeleteButton = true                                      -- Define if the player can delete their characters or not
Config.customNationality = false                                      -- Defines if Nationality input is a free text input or a country list
Config.SkipSelection = false                                          -- Skip the spawn selection and spawns the player at the last location
