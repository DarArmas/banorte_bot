function dispatchEmail(subject, body) {
  if (subject.includes('Compra en Comercio')) {
    return parsePurchaseEmail(body);
  }

  // Future flavors 👇
  // if (subject.includes('Transferencia')) {
  //   return parseTransferEmail(body);
  // }

  Logger.log('⚠️ Unknown email type: ' + subject);
  return null;
}