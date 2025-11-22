import React from 'react';
import { HelpCircle, X } from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';
import CollapsibleSection from './CollapsibleSection';

const FAQ = ({ onClose }) => {
  const { language, t } = useLanguage();

  const faqData = {
    ru: [
      {
        q: 'Как экспортировать календарь?',
        a: 'Используйте кнопки экспорта в панели управления. Доступны форматы PDF (для печати), PNG (изображение) и iCal (для импорта праздников в другие календари).',
      },
      {
        q: 'Как добавить свой праздник?',
        a: 'Перейдите в секцию "Праздники", выберите "Пользовательские праздники", введите дату и название, затем нажмите "Добавить".',
      },
      {
        q: 'Можно ли использовать приложение оффлайн?',
        a: 'Да! Приложение поддерживает PWA (Progressive Web App). После первого посещения оно будет работать даже без интернета.',
      },
      {
        q: 'Как изменить язык интерфейса?',
        a: 'В верхней части панели управления есть селектор языка. Выберите нужный язык из списка: русский, английский, испанский, португальский или немецкий.',
      },
      {
        q: 'Как включить темную тему?',
        a: 'В секции "Цветовая тема" отметьте чекбокс "Темная тема". Приложение автоматически определяет системную тему при первом запуске.',
      },
      {
        q: 'Сохраняются ли мои настройки?',
        a: 'Да, все настройки автоматически сохраняются в локальное хранилище браузера и восстанавливаются при следующем посещении.',
      },
      {
        q: 'Какие режимы отображения доступны?',
        a: 'Доступны 4 режима: Год (годовой планировщик), Месяц (календарь месяца), Неделя (недельный планировщик) и День (почасовой планировщик).',
      },
      {
        q: 'Можно ли распечатать календарь?',
        a: 'Да, нажмите кнопку "Печать" или используйте Ctrl+P (Cmd+P на Mac). Доступны книжная и альбомная ориентации.',
      },
    ],
    en: [
      {
        q: 'How to export calendar?',
        a: 'Use export buttons in the control panel. Available formats: PDF (for printing), PNG (image) and iCal (for importing holidays to other calendars).',
      },
      {
        q: 'How to add custom holiday?',
        a: 'Go to "Holidays" section, select "Custom Holidays", enter date and name, then click "Add".',
      },
      {
        q: 'Can I use the app offline?',
        a: 'Yes! The app supports PWA (Progressive Web App). After first visit it will work even without internet.',
      },
      {
        q: 'How to change interface language?',
        a: 'At the top of control panel there is a language selector. Choose language: Russian, English, Spanish, Portuguese or German.',
      },
      {
        q: 'How to enable dark mode?',
        a: 'In "Color Theme" section check "Dark Mode" checkbox. App automatically detects system theme on first launch.',
      },
      {
        q: 'Are my settings saved?',
        a: 'Yes, all settings are automatically saved to browser local storage and restored on next visit.',
      },
      {
        q: 'What view modes are available?',
        a: '4 modes available: Year (year planner), Month (month calendar), Week (week planner) and Day (hourly planner).',
      },
      {
        q: 'Can I print the calendar?',
        a: 'Yes, click "Print" button or use Ctrl+P (Cmd+P on Mac). Portrait and landscape orientations available.',
      },
    ],
    es: [
      {
        q: '¿Cómo exportar el calendario?',
        a: 'Use los botones de exportación en el panel de control. Formatos disponibles: PDF (para imprimir), PNG (imagen) e iCal (para importar festivos).',
      },
      {
        q: '¿Cómo agregar un festivo personalizado?',
        a: 'Vaya a "Días Festivos", seleccione "Días Festivos Personalizados", ingrese fecha y nombre, luego haga clic en "Agregar".',
      },
      {
        q: '¿Puedo usar la aplicación sin conexión?',
        a: 'Sí! La aplicación soporta PWA. Después de la primera visita funcionará incluso sin internet.',
      },
      {
        q: '¿Cómo cambiar el idioma?',
        a: 'En la parte superior del panel hay un selector de idioma. Elija: ruso, inglés, español, portugués o alemán.',
      },
      {
        q: '¿Cómo activar el modo oscuro?',
        a: 'En la sección "Tema de Color" marque "Modo Oscuro". La app detecta automáticamente el tema del sistema.',
      },
      {
        q: '¿Se guardan mis configuraciones?',
        a: 'Sí, todas las configuraciones se guardan automáticamente en el almacenamiento local y se restauran en la próxima visita.',
      },
      {
        q: '¿Qué modos de vista están disponibles?',
        a: '4 modos: Año (planificador anual), Mes (calendario mensual), Semana (planificador semanal) y Día (planificador por horas).',
      },
      {
        q: '¿Puedo imprimir el calendario?',
        a: 'Sí, haga clic en "Imprimir" o use Ctrl+P (Cmd+P en Mac). Orientaciones vertical y horizontal disponibles.',
      },
    ],
    pt: [
      {
        q: 'Como exportar o calendário?',
        a: 'Use os botões de exportação no painel de controle. Formatos disponíveis: PDF (para impressão), PNG (imagem) e iCal (para importar feriados).',
      },
      {
        q: 'Como adicionar feriado personalizado?',
        a: 'Vá para "Feriados", selecione "Feriados Personalizados", digite data e nome, depois clique em "Adicionar".',
      },
      {
        q: 'Posso usar o app offline?',
        a: 'Sim! O app suporta PWA. Após a primeira visita funcionará mesmo sem internet.',
      },
      {
        q: 'Como mudar o idioma?',
        a: 'No topo do painel de controle há um seletor de idioma. Escolha: russo, inglês, espanhol, português ou alemão.',
      },
      {
        q: 'Como ativar modo escuro?',
        a: 'Na seção "Tema de Cor" marque "Modo Escuro". O app detecta automaticamente o tema do sistema.',
      },
      {
        q: 'Minhas configurações são salvas?',
        a: 'Sim, todas as configurações são salvas automaticamente no armazenamento local e restauradas na próxima visita.',
      },
      {
        q: 'Quais modos de visualização estão disponíveis?',
        a: '4 modos: Ano (planejador anual), Mês (calendário mensal), Semana (planejador semanal) e Dia (planejador por horas).',
      },
      {
        q: 'Posso imprimir o calendário?',
        a: 'Sim, clique em "Imprimir" ou use Ctrl+P (Cmd+P no Mac). Orientações retrato e paisagem disponíveis.',
      },
    ],
    de: [
      {
        q: 'Wie exportiere ich den Kalender?',
        a: 'Verwenden Sie die Export-Schaltflächen im Bedienfeld. Verfügbare Formate: PDF (zum Drucken), PNG (Bild) und iCal (zum Importieren von Feiertagen).',
      },
      {
        q: 'Wie füge ich einen benutzerdefinierten Feiertag hinzu?',
        a: 'Gehen Sie zu "Feiertage", wählen Sie "Benutzerdefinierte Feiertage", geben Sie Datum und Name ein, klicken Sie dann auf "Hinzufügen".',
      },
      {
        q: 'Kann ich die App offline nutzen?',
        a: 'Ja! Die App unterstützt PWA. Nach dem ersten Besuch funktioniert sie auch ohne Internet.',
      },
      {
        q: 'Wie ändere ich die Sprache?',
        a: 'Oben im Bedienfeld befindet sich ein Sprachselektor. Wählen Sie: Russisch, Englisch, Spanisch, Portugiesisch oder Deutsch.',
      },
      {
        q: 'Wie aktiviere ich den dunklen Modus?',
        a: 'Im Abschnitt "Farbthema" aktivieren Sie "Dunkler Modus". Die App erkennt automatisch das Systemthema.',
      },
      {
        q: 'Werden meine Einstellungen gespeichert?',
        a: 'Ja, alle Einstellungen werden automatisch im lokalen Speicher gespeichert und beim nächsten Besuch wiederhergestellt.',
      },
      {
        q: 'Welche Ansichtsmodi sind verfügbar?',
        a: '4 Modi: Jahr (Jahresplaner), Monat (Monatskalender), Woche (Wochenplaner) und Tag (Stundenplaner).',
      },
      {
        q: 'Kann ich den Kalender drucken?',
        a: 'Ja, klicken Sie auf "Drucken" oder verwenden Sie Strg+P (Cmd+P auf Mac). Hoch- und Querformat verfügbar.',
      },
    ],
  };

  const faqs = faqData[language] || faqData.ru;

  return (
    <div className="faq-overlay" onClick={onClose}>
      <div className="faq-modal" onClick={e => e.stopPropagation()}>
        <div className="faq-header">
          <h2>
            <HelpCircle size={24} style={{ display: 'inline', verticalAlign: 'middle' }} />{' '}
            {t('faq')}
          </h2>
          <button className="faq-close" onClick={onClose}>
            <X size={20} />
          </button>
        </div>
        <div className="faq-content">
          {faqs.map((faq, index) => (
            <CollapsibleSection key={index} title={faq.q} defaultOpen={index === 0}>
              <p>{faq.a}</p>
            </CollapsibleSection>
          ))}
        </div>
      </div>
    </div>
  );
};

export default React.memo(FAQ);
