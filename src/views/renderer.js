/**
 * Processos de Renderização
 */

console.log("Processo de Renderização")

// Botão OK (janela sobre)
function fechar() {
    api.fecharJanela()
}

// Capturar o id de textArea (IMPORTANTE!!!)
const area = document.getElementById('txtArea')

// inicar o app com foco na área de digitação
area.focus()

// Numeração automática de linhas
function atualizarLinhas() {
    // capturar o id do conatiner das linhas
    const linhasNumeradas = document.getElementById('linhas')
    // varíavel de apoio usada na renderização das linhas do html
    let linhasNumeradasHTML = ""
    // divide o conteúdo da área de texto (tag textArea) em um array de linhas, utilizando o \n como delimitador (nova linha)
    let linha = area.value.split('\n')
    // percorrer o array de linhas adicionando uma linha a cada loop 
    for (let i = 0; i < linha.length; i++) {
        linhasNumeradasHTML += i + 1 + '<br>'
    }
    // atualizar o documento html
    linhasNumeradas.innerHTML = linhasNumeradasHTML
}

// Inicar automáticamente a função junto ao APP (linha 1)
atualizarLinhas()

// Adicionar um evento de entrada a área de texto (textArea) para atualizar as linhas numeradas
area.addEventListener('input', () => {
    atualizarLinhas()
})

// Adicionar um evento de rolagem a área de texto (textArea) para sincronizar com as linhas
area.addEventListener('scroll', () => {
    document.getElementById('linhas').scrollTop = area.scrollTop
})

// Identação do código ao pressionar TAB
area.addEventListener('keydown', (event) => {
    if (event.key === 'Tab') {
        // ignorar o comportamento padrão
        event.preventDefault()
        // varíaveis de apoio
        const textarea = event.target
        const start = textarea.selectionStart
        const end = textarea.selectionEnd
        // definir o número de espaços para o TAB
        // Dica: usar o "\t" para o TAB real do sistema
        const ident = '  ' // TAB equivale a 2 espaços
        // Adicionar a identação no ponto do cursor
        textarea.value = textarea.value.substring(0, start) + ident + textarea.value.substring(end)
        // Mover o cursor para frente após a identação
        textarea.selectionStart = textarea.selectionEnd = start + ident.length
    }
})

// mudar a cor de texto
api.setColor((event, color) => {
    // validação
    if (area) {
        // trocar a cor da fonte do (style -> CSS)
        area.style.color = color
    }
})

// Novo Arquivo / Abrir Arquivo
// Novo arquivo: Carregar a estrutura do arquivo e mudar o título
// Abrir Arquivo: Abrir um arquivo já existente3
api.setFile((event, file) => {
    area.value = file.content
    // capturar o id do título
    const nomeArquivo = document.getElementById('titulo')
    nomeArquivo.innerHTML = `${file.name} - Mini Dev Editor`
    atualizarLinhas()
})

// Atulaização de conteúdo(objeto file) em tempo real.

function update() {
    api.atualizarConteudo(area.value)
}