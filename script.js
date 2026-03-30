var inputTitulo     = document.getElementById('inputTitulo');
var inputDescricao  = document.getElementById('inputDescricao');
var inputData       = document.getElementById('inputData');
var inputPrioridade = document.getElementById('inputPrioridade');
var btnSalvar       = document.getElementById('btnSalvar');
var listaTarefas    = document.getElementById('listaTarefas');

var tarefas = JSON.parse(localStorage.getItem('tarefas')) || [];

exibirTarefas();

btnSalvar.addEventListener('click', function () {
  var titulo     = inputTitulo.value.trim();
  var descricao  = inputDescricao.value.trim();
  var data       = inputData.value;
  var prioridade = inputPrioridade.value;

  if (titulo === '') {
    alert('Por favor, informe o título da tarefa.');
    return;
  }

  var novaTarefa = {
    titulo:     titulo,
    descricao:  descricao,
    data:       data,
    prioridade: prioridade
  };

  tarefas.push(novaTarefa);
  localStorage.setItem('tarefas', JSON.stringify(tarefas));

  inputTitulo.value     = '';
  inputDescricao.value  = '';
  inputData.value       = '';
  inputPrioridade.value = 'media';

  exibirTarefas();
});

function exibirTarefas() {
  listaTarefas.innerHTML = '';

  tarefas.forEach(function (tarefa) {
    var li = document.createElement('li');

    var dataFormatada = tarefa.data
      ? new Date(tarefa.data + 'T00:00:00').toLocaleDateString('pt-BR')
      : 'Sem data';

    li.innerHTML =
      '<strong>' + tarefa.titulo + '</strong>' +
      (tarefa.descricao ? '<span>' + tarefa.descricao + '</span>' : '') +
      '<span>📅 ' + dataFormatada + '  |  Prioridade: ' + tarefa.prioridade + '</span>';

    listaTarefas.appendChild(li);
  });
}