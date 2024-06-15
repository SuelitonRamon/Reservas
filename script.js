function criarCalendario() {
  const calendario = document.getElementById('calendario');
  const detalhesEvento = document.getElementById('detalhesEvento');
  const paginaEspecifica = document.getElementById('paginaEspecifica');
  const fecharDetalhes = document.getElementById('fecharDetalhes');
  
  detalhesEvento.style.display = 'none';

  const dataAtual = new Date();
  let mesAtual = dataAtual.getMonth();
  let anoAtual = dataAtual.getFullYear();

  const meses = ['Janeiro', 'Fevereiro', 'Março', 'Abril', 'Maio', 'Junho', 'Julho', 'Agosto', 'Setembro', 'Outubro', 'Novembro', 'Dezembro'];

  const diasDaSemana = ['Dom', 'Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sáb'];

  function atualizarCalendario() {
    const diasNoMes = new Date(anoAtual, mesAtual + 1, 0).getDate();

    let html = '<table>';
    html += '<tr><th colspan="7">';
    html += `<div style="float: left;"><button onclick="mudarMes(-1)">&lt;</button></div>`;
    html += `<div style="float: right;"><button onclick="mudarMes(1)">&gt;</button></div>`;
    html += `<div style="display: inline-block;">${meses[mesAtual]} ${anoAtual}</div>`;
    html += '</th></tr>';
    html += '<tr>';

    for (let dia of diasDaSemana) {
      html += '<th>' + dia + '</th>';
    }

    html += '</tr><tr>';

    let diaSemana = new Date(anoAtual, mesAtual, 1).getDay();

    for (let i = 0; i < diaSemana; i++) {
      html += '<td></td>';
    }

    for (let dia = 1; dia <= diasNoMes; dia++) {
      diaSemana = new Date(anoAtual, mesAtual, dia).getDay();

      if (diaSemana === 0) {
        html += '</tr><tr>';
      }

      html += `<td onclick="mostrarDetalhesEvento(${dia})">${dia}</td>`;
    }

    html += '</tr>';
    html += '</table>';

    calendario.innerHTML = html;
  }

  window.mudarMes = function(delta) {
    mesAtual += delta;

    if (mesAtual === -1) {
      mesAtual = 11;
      anoAtual--;
    } else if (mesAtual === 12) {
      mesAtual = 0;
      anoAtual++;
    }

    atualizarCalendario();
  };

// script.js

window.mostrarDetalhesEvento = function(dia) {
  const detalhesEvento = document.getElementById('detalhesEvento');
  detalhesEvento.style.display = 'flex'; // Exibe a div de detalhes

  const paginaEspecifica = document.getElementById('paginaEspecifica');
  paginaEspecifica.href = `dia.html?data=${dia}-${mesAtual + 1}-${anoAtual}`;

  // Recupera eventos do localStorage para a data específica
  let eventos = JSON.parse(localStorage.getItem('eventos')) || {};
  const dataEvento = `${dia}-${mesAtual + 1}-${anoAtual}`;
  const eventosDoDia = eventos[dataEvento] || [];

  // Limita a exibição a no máximo quatro eventos
  const eventosExibidos = eventosDoDia.slice(0, 4);

  // Constrói o HTML para exibir os eventos na div camada
  let html = '';
  eventosExibidos.forEach(evento => {
    html += `<p><strong>Título:</strong> ${evento.titulo}</p>`;
    html += `<p><strong>Descrição:</strong> ${evento.descricao}</p>`;
    html += `<p><strong>Hora:</strong> ${evento.hora}</p>`;
    html += `<hr>`;
  });

  // Se houver mais eventos que não foram exibidos, adiciona uma mensagem
  if (eventosDoDia.length > 4) {
    html += `<p>Clique em "Consultar" para ver todas as reservas.</p>`;
  }

  // Atualiza o conteúdo da div camada com os eventos
  document.querySelector('#detalhesEvento .conteudo').innerHTML = html;
};


window.fecharDetalhes = function() {
  const detalhesEvento = document.getElementById('detalhesEvento');
  detalhesEvento.style.display = 'none'; // Esconde a div de detalhes
};

  atualizarCalendario();
}

criarCalendario();