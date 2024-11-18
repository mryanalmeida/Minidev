console.log("Processo Principal")

// Importação de pacotes (bibliotecas)
// nativeTheme (forçar um tema no sistema operacional)
// Menu (criar um menu personalizado)
// shell (acessar links externos)
const { app, BrowserWindow, nativeTheme, Menu, shell, ipcMain, dialog } = require('electron/main')
const path = require('node:path')

// Importação da biblioteca file system (nativa do Java Script) para manipular arquivos
const fs = require('fs')
const { readFileSync } = require('node:fs')

// Criação de um objeto com a característica básica de um arquivo
let file = {}

// Janela Principal
let win // Importante! Neste projeto o escopo da varíavel win deve ser global
function createWindow() {
    nativeTheme.themeSource = 'dark' // Janela sempre escura
    win = new BrowserWindow({
        width: 1010, // Largura em px
        height: 720, // Altura em px
        webPreferences: {
            preload: path.join(__dirname, 'preload.js')
        }
    })

    // Menu personalizado
    Menu.setApplicationMenu(Menu.buildFromTemplate(template))

    win.loadFile('./src/views/index.html')
}

// Janela Sobre
function aboutWindow() {
    nativeTheme.themeSource = "dark"
    // A linha abaixo obtem a janela principal
    const main = BrowserWindow.getFocusedWindow()
    let about
    // Validar a janela pai
    if (main) {
        about = new BrowserWindow({
            width: 320,
            height: 160,
            autoHideMenuBar: true, // Esconder o menu
            resizable: false, // Impedir redimensionamento
            minimizable: false, // Impedir minimizar a janela
            //titleBarStyle: "hidden" // Esconder a barra de estilo (ex: totem de auto atendimento)
            parent: main, // Estabelecer uma hierarquia de janelas
            modal: true,
            webPreferences: {
                preload: path.join(__dirname, 'preload.js')
            }
        })
    }

    about.loadFile('./src/views/sobre.html')

    // Fechar a janela quando receber mensagem do processo de renderização.
    ipcMain.on('close-about', () => {
        // console.log("recebi a mensagem de fechar")
        // Validar se a janela foi destruida
        if (about && !about.isDestroyed()) {
            about.close()
        }
    })

}

// Execução assíncrona do aplicativo electron
app.whenReady().then(() => {
    createWindow()

    // Comportamento do MAC ao fechar uma janela
    app.on('activate', () => {
        if (BrowserWindow.getAllWindows().length === 0) {
            createWindow()
        }
    })
})

// Encerrar a aplicação quando a janela for fechada (windows e linux)
app.on('window-all-closed', () => {
    if (process.platform !== 'darwin') {
        app.quit()
    }
})

// Template do menu
const template = [
    {
        label: 'Arquivo',
        submenu: [
            {
                label: 'Novo',
                accelerator: 'CmdOrCtrl+N',
                click: () => novoArquivo()
            },

            {
                label: 'Abrir',
                accelerator: 'CmdOrCtrl+O',
                click: () => abrirArquivo()
            },
            {
                label: 'Salvar',
                accelerator: 'CmdOrCtrl+S',
                click: () => salvar()
            },
            {
                label: 'Salvar Como',
                accelerator: 'CmdOrCtrl+Shift+S',
                click: () => salvarComo()
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
                type: 'separator'
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
                label: 'Colar',
                role: 'paste'
            },
        ]
    },

    {
        label: 'Zoom',
        submenu: [
            {
                label: 'Aplicar zoom',
                role: 'zoomIn'
            },

            {
                label: 'Reduzir',
                role: 'zoomOut'
            },

            {
                label: 'Restaurar o zoom padrão',
                role: 'resetZoom'
            },
        ]
    },

    {
        label: 'Cor',
        submenu: [
            {
                label: 'Amarelo',
                click: () => win.webContents.send('set-color', "var(--amarelo)")
            },

            {
                label: 'Azul',
                click: () => win.webContents.send('set-color', "var(--azul)")
            },

            {
                label: 'Laranja',
                click: () => win.webContents.send('set-color', "var(--laranja)")
            },

            {
                label: 'Pink',
                click: () => win.webContents.send('set-color', "var(--pink)")
            },

            {
                label: 'Roxo',
                click: () => win.webContents.send('set-color', "var(--roxo)")
            },

            {
                label: 'Verde',
                click: () => win.webContents.send('set-color', "var(--verde)")
            },

            {
                type: 'separator'
            },

            {
                label: 'Restaurar a cor padrão',
                click: () => win.webContents.send('set-color', "var(--cinzaClaro)")
            }
        ]
    },

    {
        label: 'Ajuda',
        submenu: [
            {
                label: 'Repositório',
                click: () => shell.openExternal('https://github.com/Fonseca-J/minidev')
            },

            {
                label: 'Sobre',
                click: () => aboutWindow()
            }
        ]
    }
]

// Novo arquivo >>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>
// Passo 1: Criar a estrtura de um arquivo e setar o título
// Um arquivo inicia sem título, sem conteúdo, não está salvo e o local padrão vai ser a documentos
function novoArquivo() {
    file = {
        name: "Sem título",
        content: "",
        saved: false,
        path: app.getPath('documents') + 'Sem título'
    }
    // console.log(file)
    
    // enviar ao renderizador a estrtura de um novo arquivo e título
    win.webContents.send('set-file', file)
}

// >>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>

// Abrir arquivo <<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<
// 2 funções - abrirArquivo() e lerArquivo(caminho)
async function abrirArquivo() {
// Usar um módulo de Electron para abrir o explorador de arquivos
let dialogFile = await dialog.showOpenDialog({
    defaultPath: file.path // selecionar o arquivo no local dele
})
//console.log(dialogFile)
//validação do botão [cancelar]
if(dialogFile.canceled === true) {
    return false
} else {
    // abrir o arquivo
    file = {
        name: path.basename(dialogFile.filePaths[0]),
        content: lerArquivo(dialogFile.filePaths[0]),
        saved: true, 
        path: dialogFile.filePaths[0]
    }
}
// console.log(file)
// enviar o arquivo para o redenrizador
win.webContents.send('set-file', file)

}

function lerArquivo(filePath){
    // Usar o trycath sempre que trabalhar com arquivos
    try {
        // a linha abaixo utiliza da biblioteca fs para ler um arquivo, informando o caminho d o ecoding do arquivo. 
        return fs.readFileSync(filePath, 'utf-8')
    } catch (error) {
        console.log(error)
        return''
    }
}

//>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>

// Salvar e Salvar como... >>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>
// 3 funções (1) Salvar como (2) Salvar (3) Salvar Arquivo(fs)
//<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<
async function salvarComo(){
    let dialogFile = await dialog.showSaveDialog({
        defaultPath: file.path
        
    })
    //console.log(dialogFile)
    if (dialogFile.canceled === true) {
        
    } else {
        salvarArquivo(dialogFile.filePath)
    }
}

function salvar() {
if (file.saved === true) {
    return salvarArquivo(file.path)
} else {
    return salvarComo()
    
}
}

function salvarArquivo(filePath) {
    try {
        // uso da biblioteca fs para gravar um arquivo
        fs.writeFile(filePath,file.content, (error) => {
            file.path = filePath
            file.saved = true
            file.name = path.basename(filePath)
            // aterar o titulo ao salvar o arquivo
            win.webContents.send('set-file', file)

        })  
        //console.log(error) 
    } catch (error) {
        
    }
}

// Atualização em tempo real do conteudo do objeto file
ipcMain.on('update-content', (event, value) => {
    file.content = value
})