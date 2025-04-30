# Nowy Projekt

Prosty szablon projektu HTML, CSS i JS.

## Struktura
- `index.html` — główny plik HTML
- `style.css` — style
- `app.js` — logika JS

## Uruchomienie
Otwórz `index.html` w przeglądarce.

## Instrukcja obsługi aplikacji (Boxing Round Interval Timer)

Aplikacja służy do odmierzania czasu rund bokserskich z przerwami na odpoczynek.

### Funkcje i obsługa:
- **Start** — Rozpoczyna odliczanie czasu rundy. Jeśli timer był zakończony, resetuje licznik i zaczyna od nowa.
- **Stop** — Zatrzymuje (pauzuje) aktualne odliczanie czasu. Możesz wznowić klikając ponownie Start.
- **Reset** — Ustawia licznik na początek (runda 1, 3 minuty, status PREPARE).

### Statusy wyświetlane na ekranie:
- **PREPARE** — Timer gotowy do rozpoczęcia, naciśnij Start.
- **WORK** — Trwa runda bokserska (domyślnie 3 minuty).
- **REST** — Przerwa między rundami (domyślnie 1 minuta).
- **PAUSED** — Timer zatrzymany w trakcie rundy lub przerwy.
- **FINISHED** — Wszystkie rundy zakończone.

### Dodatkowe informacje:
- Liczba rund: 12 (domyślnie)
- Czas rundy: 3 minuty
- Czas przerwy: 1 minuta
- Aktualny numer rundy i całkowita liczba rund wyświetlane są pod timerem.
- Po zakończeniu wszystkich rund pojawia się status FINISHED.

## Instalacja npm
Projekt korzysta z npm do zarządzania zależnościami (jeśli będą potrzebne).

```bash
npm install
``` 