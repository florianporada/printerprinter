import style from './style.css'; // eslint-disable-line
import milligram from 'milligram'; // eslint-disable-line
import $ from 'jquery';

function showMessage(message) {
  const panel = $('.infopanel');
  panel.html(message || ':)');
  panel.animate({ opacity: 1 });

  setTimeout(() => {
    panel.animate({ opacity: 0 });
  }, 5000);
}

function getConfig() {
  $.getJSON('/config', data => {
    $('#uidField').val(data.uid);
    $('#nameField').val(data.name);
    $('#connectionUrlField').val(data.url);
    $('#baudrateField').val(data.baudrate);
    $('#serialPortField').val(data.serialport);
    $('#ledPinField').val(data.ledpin);

    showMessage('Fetched config from db');
  }).fail(function(err) {
    console.log(err);

    showMessage('Could not fetch config');
  });
}

function saveConfig(config) {
  $.ajax({
    url: '/config',
    type: 'PUT',
    data: JSON.stringify(config),
    dataType: 'json',
    contentType: 'application/json',
    success: function() {
      showMessage('Saved config to db');
    }
  }).fail(function(err) {
    console.log(err);

    showMessage('Could not save config');
  });
}

function resetConfig() {
  $.ajax({
    url: '/config',
    type: 'DELETE',
    success: function() {
      showMessage('Reset config in db');
    }
  }).fail(function(err) {
    console.log(err);

    showMessage('Could not reset config');
  });
}

$(function() {
  getConfig();

  $('#resetConfig').click(() => {
    resetConfig();
  });

  $('form').submit(function(event) {
    event.preventDefault();

    saveConfig({
      uid: $('#uidField').val(),
      name: $('#nameField').val(),
      url: $('#connectionUrlField').val(),
      baudrate: $('#baudrateField').val(),
      serialport: $('#serialPortField').val(),
      ledpin: $('#ledPinField').val()
    });
  });
});
