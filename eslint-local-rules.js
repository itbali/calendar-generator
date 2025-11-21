/**
 * Локальное правило ESLint для проверки использования переводов
 */
const noRawText = {
  meta: {
    type: 'problem',
    docs: {
      description: 'Запрещает использование непереведенных строк в JSX',
    },
    messages: {
      noRawText: 'Используйте функцию t() для перевода текста: "{{text}}"',
    },
  },
  create(context) {
    // Проверяет, является ли строка переводимым текстом
    function shouldBeTranslated(text) {
      const trimmed = text.trim();

      // Игнорируем пустые строки и пробелы
      if (!trimmed || trimmed.length < 2) return false;

      // Игнорируем только символы/цифры/эмодзи
      if (/^[\d\s\W✦✨⭐💎❓]+$/u.test(trimmed)) return false;

      // Проверяем наличие букв (кириллица или латиница)
      return /[a-zA-Zа-яА-ЯёЁ]{3,}/.test(trimmed);
    }

    return {
      JSXText(node) {
        if (shouldBeTranslated(node.value)) {
          context.report({
            node,
            messageId: 'noRawText',
            data: { text: node.value.trim().substring(0, 30) },
          });
        }
      },

      JSXAttribute(node) {
        // Проверяем только определенные атрибуты
        const translatableAttrs = ['title', 'placeholder', 'alt', 'aria-label'];
        const attrName = node.name.name;

        if (!translatableAttrs.includes(attrName)) return;

        if (node.value?.type === 'Literal' && typeof node.value.value === 'string') {
          if (shouldBeTranslated(node.value.value)) {
            context.report({
              node: node.value,
              messageId: 'noRawText',
              data: { text: node.value.value.substring(0, 30) },
            });
          }
        }
      },
    };
  },
};

export default {
  rules: {
    'no-raw-text': noRawText,
  },
};
