function searchBanorteEmails() {
  const threads = GmailApp.search('from:notificacionesbanorte@banorte.com label:bot_banorte_pending');

  Logger.log('Threads found: ' + threads.length);

  const labelPending = GmailApp.getUserLabelByName('bot_banorte_pending');
  const labelCompleted = GmailApp.getUserLabelByName('bot_banorte_completed');

  threads.forEach((thread, i) => {
    const messages = thread.getMessages();

    messages.forEach((message, j) => {
      const subject = message.getSubject();
      const body = message.getBody();

      Logger.log('--- Thread ' + i + ' | Email ' + j + ' ---');

      const result = dispatchEmail(subject, body);

      if (result) {
        addExpense(result);
      }
    });

    thread.removeLabel(labelPending);
    thread.addLabel(labelCompleted);
  });
}