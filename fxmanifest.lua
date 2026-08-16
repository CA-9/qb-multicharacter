fx_version 'cerulean'
game 'gta5'
lua54 'yes'

author 'MT'
description 'QB-Core Multicharacter with React NUI'
version '1.0.0'

shared_scripts {
    '@qb-core/shared/locale.lua',
    'locales/en.lua',
    'locales/*.lua',
    'config.lua'
}

client_scripts {
    'client.lua'
}

server_scripts {
    '@oxmysql/lib/MySQL.lua',
    '@qb-apartments/config.lua',
    'server.lua'
}

ui_page 'html/dist/index.html'

files {
    'html/dist/index.html',
    'html/dist/assets/*.js',
    'html/dist/assets/*.css',
}

dependencies {
    'qb-core',
}
