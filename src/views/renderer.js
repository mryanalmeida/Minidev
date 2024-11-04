/**
 * Processos de renderização
 */

console.log("Processo de renderização")

// Botão OK (Janela sobre)
function fechar() {
   api.fecharJanela()
}

//capturar o id de textArea

const area = document.getElementById('txtArea')
area.focus() //iniciar o app com foco na área de digitação

//numeração automatica de linha

function atualizarLinha() {
   //capiturar o id do coinainer das linha
   const linhaNumeradas = document.getElementById('linhas')
   //Variavel de apoio usada na renderização das linha no html
   let linhaNumeradasHTML = ""
   //divide conteudo da área de texto (tag textarea) em umarry de linha ultilizando \n com delilitador (nova linha
   let linha = area.ariaValueMax.split('\n')
   //percorrer o array de linha adicionando o numero de linha a cada loop
   for (let i = 0; i < linhalength; i++) {
      linhaNumeradasHTML += 1 + '<br>'
   }
   //atualizar o documento html
   linhaNumeradas.innerHTML = linhaNumeradasHTML
}


//iniciar automaticamente a função junto com o APP (linha1)
atualizarLinha()

//adicionar um evento de entrada a área de texto (textarea) para atualizar as linha numeradas
area.addEventListener('input', () => {
   atualizarLinha()
})

//adicionar um evento de rolagem a área de texto (textarea) para sincronizar com as linha 
area.addEventListener('scroll', () => {
   document.getElementById('linha').scrollTop = area.scrollTop
})
