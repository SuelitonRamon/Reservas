window.onload = function() {
  const dataEspecifica = document.getElementById('dataEspecifica');
  const listaEventos = document.getElementById('listaEventos');
  const novoEventoForm = document.getElementById('novoEventoForm');
  const formEvento = document.getElementById('formEvento');
  const mensagensErro = document.getElementById('mensagensErro');
  const voltarBtn = document.getElementById('voltar');
  const parametros = new URLSearchParams(window.location.search);
  const dataParametro = parametros.get('data');
  const dataSplit = dataParametro.split('-');
  const dia = parseInt(dataSplit[0]);
  const mes = parseInt(dataSplit[1]);
  const ano = parseInt(dataSplit[2]);

  const mesesPorExtenso = ['janeiro', 'fevereiro', 'março', 'abril', 'maio', 'junho', 'julho', 'agosto', 'setembro', 'outubro', 'novembro', 'dezembro'];
  const dataExtenso = `${dia} de ${mesesPorExtenso[mes - 1]} de ${ano}`;
  
  dataEspecifica.textContent = dataExtenso;

  let eventos = JSON.parse(localStorage.getItem('eventos')) || {};
  const dataEvento = `${dia}-${mes}-${ano}`;

  function ordenarEventosPorHora(eventos) {
    return eventos.sort((a, b) => a.hora.localeCompare(b.hora));
  }

  function atualizarListaEventos() {
    listaEventos.innerHTML = '';
    const eventosDia = eventos[dataEvento] || [];

    if (eventosDia.length === 0) {
      listaEventos.innerHTML = '<p>Não há eventos para este dia.</p>';
    } else {
      const eventosOrdenados = ordenarEventosPorHora(eventosDia);
      eventosOrdenados.forEach((evento) => {
        const eventoDiv = document.createElement('div');
        eventoDiv.classList.add('evento');

        const titulo = document.createElement('h3');
        titulo.textContent = evento.titulo;

        const descricao = document.createElement('p');
        descricao.textContent = evento.descricao;

        const hora = document.createElement('p');
        hora.textContent = `Hora: ${evento.hora}`;

        const botaoEditar = document.createElement('button');
        botaoEditar.textContent = 'Editar';
        botaoEditar.classList.add('botao', 'editar');
        botaoEditar.onclick = function() {
          editarEvento(evento.id);
        };

        const botaoRemover = document.createElement('button');
        botaoRemover.textContent = 'Remover';
        botaoRemover.classList.add('botao', 'remover');
        botaoRemover.onclick = function() {
          removerEvento(evento.id);
        };

        eventoDiv.appendChild(titulo);
        eventoDiv.appendChild(descricao);
        eventoDiv.appendChild(hora);
        eventoDiv.appendChild(botaoEditar);
        eventoDiv.appendChild(botaoRemover);

        listaEventos.appendChild(eventoDiv);
      });
    }
  }

  function removerEvento(id) {
    eventos[dataEvento] = eventos[dataEvento].filter(evento => evento.id !== id);
    if (eventos[dataEvento].length === 0) {
      delete eventos[dataEvento];
    }
    localStorage.setItem('eventos', JSON.stringify(eventos));
    atualizarListaEventos();
  }

  function editarEvento(id) {
    const evento = eventos[dataEvento].find(evento => evento.id === id);
    document.getElementById('titulo').value = evento.titulo;
    document.getElementById('descricao').value = evento.descricao;
    document.getElementById('hora').value = evento.hora;
    document.getElementById('eventoId').value = id;
    mostrarForm();
  }

  function validarHorario(hora, id) {
    const [horaNova, minutoNovo] = hora.split(':').map(Number);
    const eventosDia = eventos[dataEvento] || [];

    for (const evento of eventosDia) {
      if (evento.id !== id) {
        const [horaEvento, minutoEvento] = evento.hora.split(':').map(Number);
        const diferenca = Math.abs((horaNova * 60 + minutoNovo) - (horaEvento * 60 + minutoEvento));
        if (diferenca < 30) {
          mostrarErro('Não é possível adicionar uma reserva com menos de 30 minutos de diferença de outra reserva.');
          return false;
        }
      }
    }
    limparErros();
    return true;
  }

  window.mostrarForm = function() {
    novoEventoForm.style.display = 'flex';
  };

  window.fecharForm = function() {
    novoEventoForm.style.display = 'none';
  };

  function mostrarErro(mensagem) {
    mensagensErro.innerHTML = `<p class="erro">${mensagem}</p>`;
    mensagensErro.style.display = 'block';
  }

  function limparErros() {
    mensagensErro.innerHTML = '';
    mensagensErro.style.display = 'none';
  }
  
  formEvento.onsubmit = function(event) {
    event.preventDefault();

    const titulo = document.getElementById('titulo').value;
    const descricao = document.getElementById('descricao').value;
    const hora = document.getElementById('hora').value;
    const id = document.getElementById('eventoId').value || generateUniqueId();

    if (!validarHorario(hora, id)) {
      return;
    }
  
    if (!eventos[dataEvento]) {
      eventos[dataEvento] = [];
    }
  
    const eventoExistente = eventos[dataEvento].find(evento => evento.id === id);
    if (eventoExistente) {
      eventoExistente.titulo = titulo;
      eventoExistente.descricao = descricao;
      eventoExistente.hora = hora;
    } else {
      eventos[dataEvento].push({ id, titulo, descricao, hora });
    }

    localStorage.setItem('eventos', JSON.stringify(eventos));
  
    fecharForm();
    atualizarListaEventos();
  
    document.getElementById('titulo').value = '';
    document.getElementById('descricao').value = '';
    document.getElementById('hora').value = '';
    document.getElementById('eventoId').value = '';
  };

  function generateUniqueId() {
    return '_' + Math.random().toString(36).substr(2, 9);
  }
  
  atualizarListaEventos();

  voltarBtn.onclick = function() {
    history.back();
  }
};
