function dispatchEmail(subject, body) {
  if (subject.includes('Compra en Comercio')) {
    return parsePurchaseEmail(body);
  }

  if (subject.includes('Notificaciones Eventos por Cuenta')) {
    return parseTransferEmail(body);
  }

  Logger.log('⚠️ Unknown email type: ' + subject);
  return null;
}