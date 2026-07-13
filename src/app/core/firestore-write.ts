import { NotificationService } from '../shared/notification.service';

const DEFAULT_ERROR_MESSAGE = 'Não foi possível salvar. Verifique sua conexão e tente novamente.';

export async function safeWrite(notify: NotificationService, action: Promise<unknown>): Promise<void> {
  try {
    await action;
  } catch (err) {
    console.error(err);
    notify.showError(DEFAULT_ERROR_MESSAGE);
  }
}
