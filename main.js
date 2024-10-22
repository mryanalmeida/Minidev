console.log("Processo Principal")

const { shell } = require('electron')
//Importação de pacotes (Bibliotecas)
//NativeTheme (Forçar um tema no sistema operacioanal)
//Menu (Criar um menu personalizado)
//shell(acessar links externos)
const { app, BrowserWindow, nativeTheme, Menu } = require('electron/main')
const path = require('node:path')

//Janela Principal
let win //Importante! Neste projeto o escopo da variavel win deve ser global
function createWindow() {
    nativeTheme.themeSource = 'dark' //Mudar a cor do Tema (claro, escuro ou Padrão do sistema)
    win = new BrowserWindow({
        width: 1010, //largura em px.
        height: 720, //altura em px.
        webPreferences: {
            preload: path.join(__dirname, 'preload.js')
        }
    })
    //Menu Personalizado
    Menu.setApplicationMenu(Menu.buildFromTemplate(template))

    win.loadFile('./src/views/index.html')
}


//Janela sobre
function aboutWindow() {
    nativeTheme.themeSource = 'dark'
    const about = new BrowserWindow({
        width: 360,
        height: 220,
        autoHideMenuBar: true, //esonder o menu
        resizable: false,
        minimizable: false,
        //titleBarStyle: 'hidden' //para totem de auto atendimento
    })
    about.loadFile('./src/views/sobre.html')
}

//Execução assincrona do aplicativo electron
app.whenReady().then(() => {
    createWindow()

    //Comportamento do Mac ao fechar uma janela 
    app.on('activate', () => {
        if (BrowserWindow.getAllWindows().length === 0) {
            createWindow()
        }
    })
})

//encerrar a aplicação quando a janela for feichada (Windows e Linux)
app.on('window-all-closed', () => {
    if (process.platform !== 'darwin') {
        app.quit()
    }
})

//Template do menu
const template = [
    {
        label: 'Arquivo',
        submenu: [
            {
                label: 'Novo',
                accelerator: 'CmdOrCtrl+N'
            },

            {
                label: 'Abrir',
                accelerator: 'CmdOrCtrl+O'
            },
            {
                label: 'Salvar',
                accelerator: 'CmdOrCtrl+S'
            },
            {
                label: 'Salvar Como',
                accelerator: 'CmdOrCtrl+Shift+S'
            },

            {
                type: 'separator'
            },
            {
                label: 'Sair',
                accelerator: 'Alt+F4',
                click: () => app.quit()
            }

        ]
    },
    {
        label: 'Editar',
        submenu: [
            {
                label: 'Desfazer',
                role: 'undo'
            },
            {
                label: 'Refazer',
                role: 'redo'
            },
            {
                type: 'separator',
            },
            {
                label: 'Recortar',
                role: 'cut'
            },
            {
                label: 'Copiar',
                role: 'copy'
            },
            {
                label: 'colar',
                role: 'paste'
            }
        ]
    },
    {
        label: 'Zoom',
        submenu: [
            {
                label: 'Aplicar Zoom',
                role: 'zoomIn'
            },
            {
                label: 'Reduzir',
                role: 'zoomOut'
            },
            {
                label: 'Restaurar o zoom padrao',
                role: 'resetZoom'
            }
        ]
    },
    {
        label: 'Cor',
        submenu: [
            {
                label: 'Amarelo'
            },
            {
                label: 'Azul'
            },
            {
                label: 'Laranja'
            },
            {
                label: 'Pink'
            },
            {
                label: 'Roxo'
            },
            {
                label: 'Verde'
            },
            {
                type: 'separator'
            },
            {
                label: 'Restaurar a cor Padrão'
            }
        ]
    },
    {
        label: 'Ajuda',
        submenu: [
            {
                label: 'Repositório',
                click: () => shell.openExternal('https://github.com/mryanalmeida/Minidev')
            },
            {
                label: 'Sobre',
                click: () => aboutWindow()
            }
        ]
    }
]