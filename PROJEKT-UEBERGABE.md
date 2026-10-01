# Tamburi AR – Projektübergabe an Alex

**Projekt:** Tamburi AR / Standortbesichtigung  
**Repository:** `JosefLab/tamburi-ar`  
**Produktiver Stand bei Übergabe:** **v10.93**  
**Übergabe an:** Alex (IT)  
**Stand:** 01.10.2026

---

## 1. Projektziel

Tamburi AR ist eine mobile Webanwendung für Standortbesichtigungen von Tamburi-Paketkästen. Vor Ort soll ein Mitarbeiter einen möglichen Aufstellort dokumentieren und den Paketkasten direkt über das Kamerabild bzw. ein Foto visualisieren können.

Der aktuelle Workflow umfasst insbesondere:

- Auswahl von 1, 2 oder 3 Paketkästen
- unterschiedliche Aufstellvarianten
- prozedural erzeugtes 3D-Modell
- Kamera-/Fotomodus
- Originalfoto und Rendering als zusammengehöriges Paar
- Standort- und Montageinformationen
- GPS-/Standortunterstützung
- Übermittlung der Standortdaten und Fotos über den bestehenden Google-Sheets-/Apps-Script-Flow
- Spracheingabe für Montagehinweise
- lokale Funktion „Professionell formulieren“ ohne externe KI-API

Die Anwendung wird derzeit über GitHub Pages bereitgestellt.

---

## 2. Aktueller stabiler Stand

Der für die Übergabe maßgebliche produktive Stand ist **v10.93**.

Wichtig: v10.94 war ein kurzfristiger Versuch, seitliche Standfüße/Standbleche in das neue prozedurale 3D-Modell zu übernehmen. Diese Umsetzung entsprach optisch nicht dem Original und wurde vollständig zurückgerollt. Die Standfüße sind daher bewusst ein offener Punkt.

Das derzeitige 3D-Modell entspricht wieder dem funktionierenden Stand vor diesem Versuch.

---

## 3. Grundarchitektur

Die Anwendung besteht aus einer bestehenden HTML-/JavaScript-Anwendung, die im Laufe des Projekts schrittweise erweitert wurde.

### Einstieg

- `index.html`
  - aktueller Einstiegspunkt
  - zeigt die Anwendung über `v1043.html` in einem iframe
  - injiziert/aktiviert aktuelle Erweiterungen
  - bindet die aktuelle 3D-Modelllogik und den aktuellen Flow ein
  - enthält zusätzliche UI-Funktionen aus späteren Versionen

### Basisanwendung

- `v1043.html`
  - historisch gewachsene Basis der Anwendung
  - enthält große Teile der ursprünglichen UI, Auswahlmöglichkeiten, Kamera-/Fotofunktionen und model-viewer-Struktur
  - trägt intern teilweise noch ältere Versionslogik
  - sollte nicht ohne Prüfung großflächig umgebaut werden

### Aktuelles 3D-Modell

- `v1086-models.js`
  - erzeugt die aktuelle Kastenanlage prozedural mit Three.js
  - exportiert sie zur Laufzeit über `GLTFExporter` als GLB
  - erzeugte Blob-URL wird anschließend den relevanten `model-viewer`-Instanzen zugewiesen
  - ist aktuell die maßgebliche Modellquelle

### Aktueller Standort-/Foto-Flow

- `v1060-flow.js`
  - aktueller Flow für Standortdaten und Foto-Paare
  - soll die führende Datenquelle für Original-/Rendering-Paare sein

### Legacy

- `v1057-reset.js`
  - Legacy-Loader wurde deaktiviert
  - aktuell nur noch Platzhalter/Schutz vor altem Flow

- `v1059-flow.js`
  - alter Flow
  - darf nicht wieder parallel zum aktuellen Flow geladen werden
  - führte in der Vergangenheit zu Versions- und Funktionskonflikten

### 3D-Testseite

- `v1061-model-test.html`
  - Entwicklungs-/Testseite für die prozedurale Geometrie
  - wurde insbesondere für Betonplatten und Betonsockel verwendet
  - nicht mit der produktiven Hauptanwendung verwechseln

---

## 4. 3D-Modell – aktuelles Konzept

Das aktuelle Modell wird nicht aus den alten statischen GLB-Dateien zusammengesetzt, sondern in `v1086-models.js` mit Three.js erzeugt.

Technik:

- Three.js über `esm.sh`
- `GLTFExporter` über `esm.sh`
- Export zur Laufzeit als binäres GLB
- Blob-URL wird in `model-viewer` geladen

Der Wechsel auf `esm.sh` war wichtig, weil frühere Modulimporte über jsDelivr beim `GLTFExporter` Probleme mit dem nicht aufgelösten `three`-Import verursachten.

### Kastenabmessungen

Grundmodul:

- Breite: ca. 100 cm
- Tiefe: ca. 65 cm
- Höhe: ca. 225 cm

Varianten:

- 1 Kasten
- 2 Kästen
- 3 Kästen

Das Hauptmodul enthält Bedien-/Displaybereich und Solarpanel. Erweiterungsmodule besitzen keinen eigenen Bedienbildschirm.

### Fachnummerierung

Aktuelles Konzept:

- Hauptkasten: 1–23
- zweiter Kasten: 24–47
- dritter Kasten: 48–71

### Branding

Das Modell enthält:

- orange Tamburi-Bänder
- Tamburi-Schriftzüge
- seitliche Beschriftung
- rückseitige Beschriftung
- „Mein Name ist“ ohne ALVA
- PAKETE.
- VERSENDEN.
- EMPFANGEN.

Bei mehreren Modulen sind sichtbare Modultrennungen vorgesehen.

---

## 5. Aufstellvarianten

Die Anwendung unterstützt derzeit:

### Normal

Kasten ohne zusätzlichen Betonsockel.

### Betonplatten 50 cm

Eine Reihe Betonplatten vor dem Kasten.

### Betonplatten 100 cm

Zwei Reihen Betonplatten vor dem Kasten.

Die Platten liegen bewusst **vor** dem Kasten und nicht unter dem Kasten.

Aktuelle Plattenlogik:

| Kästen | 50 cm | 100 cm |
|---|---:|---:|
| 1 | 2 Platten | 4 Platten |
| 2 | 4 Platten | 8 Platten |
| 3 | 6 Platten | 12 Platten |

### Betonsockel

Grundprinzip:

- ca. 100 cm Gesamttiefe
- 15 cm Überstand hinten
- 65 cm ebener Bereich unter dem Kasten
- 20 cm Gefälle/Rampe vorne
- Höhe hinten/unter dem Kasten ca. 20 cm
- Rampe fällt vorne auf ca. 10 cm ab

Beim Sockel wird der komplette Kasten entsprechend angehoben.

---

## 6. Offener Punkt: Standfüße / seitliche Standbleche

Tamburi bezeichnet die seitlich unten am Kasten befindlichen Bleche als **Standfüße**.

Wichtig: Es handelt sich **nicht** um vier kleine Füße unter jedem einzelnen Modul.

Die alten statischen GLB-Modelle enthalten diese seitlichen Bleche. Ein erster vereinfachter Nachbau in v10.94 war optisch nicht ausreichend und wurde wieder entfernt.

Für eine spätere Umsetzung sollte die Geometrie des realen Kastens bzw. der alten GLB-Modelle sauber als Referenz verwendet werden.

Gewünschte Logik:

- normale Aufstellung: Standbleche vorhanden
- Betonplatten 50 cm: Standbleche vorhanden
- Betonplatten 100 cm: Standbleche vorhanden
- Betonsockel: keine Standbleche

Nicht erneut vereinfachte rechteckige Bleche einbauen, ohne die tatsächliche Form zu prüfen.

---

## 7. Alte GLB-Dateien

Im Repository liegen weiterhin ältere GLB-Dateien, unter anderem:

- `normal_*.glb`
- `platten50_*.glb`
- `platten100_*.glb`
- `sockel_*.glb`
- `tamburi_1_kasten.glb`
- `tamburi_2_kaesten.glb`
- `tamburi_3_kaesten.glb`

Diese Dateien sind nützlich als Referenz, sind aber **nicht mehr die führende Modelllogik** der aktuellen Anwendung.

Bitte nicht versehentlich die alte `viewer.src`-Logik wieder zum maßgeblichen Modell machen.

---

## 8. Wichtige Modell-Synchronisation

In der Basisanwendung existieren mehrere `model-viewer`-Instanzen bzw. Modellziele.

Relevant sind insbesondere:

- `viewer`
- `v9Model`
- `v98FrameModel`
- `v1014UploadModel`

Das aktuelle Modell wird über `v1086-models.js` synchron auf diese Ziele übertragen.

Eine `MutationObserver`-Logik verhindert außerdem, dass ältere Logik aus `v1043.html` dauerhaft wieder eine alte GLB-Datei in `viewer.src` einsetzt.

Diese Synchronisation war ein zentraler Fix ab v10.91 und sollte bei Refactorings berücksichtigt werden.

---

## 9. Kamera- und Fotoflow

Ziel des Workflows pro Standortvariante:

1. Originalfoto des Aufstellorts ohne eingeblendeten Kasten
2. Rendering desselben Aufstellorts mit positioniertem 3D-Kasten

Diese beiden Bilder bilden **ein zusammengehöriges Paar**.

Ein Standort kann mehrere Varianten besitzen.

Der aktuelle Flow soll verhindern, dass unvollständige oder falsch zugeordnete Original-/Rendering-Paare übertragen werden.

Bei Änderungen an Kamera, Screenshot oder Upload deshalb immer den gesamten Paarungsprozess testen.

---

## 10. Standortinformationen

Aktuell bzw. geplant sind Standortdaten wie:

- Adresse
- Standort/GPS
- Montagehinweise / Besonderheiten
- Besichtiger
- Datum/Uhrzeit
- Kastentyp / Variante

Für die weitere Standortdokumentation sind außerdem wichtig:

- Genossenschaft bzw. Hausverwaltung/Hausverwalter als fachlicher Datenpunkt
- GPS-Koordinaten
- korrigierbare Adresse

Wichtig: Eine automatisch ermittelte Adresse darf nicht ungeprüft endgültig übernommen werden, weil die tatsächliche Standortadresse vor Ort häufig korrigiert werden muss.

Der Standort sollte bereits **vor dem Fotografieren** abgerufen werden können.

---

## 11. Spracheingabe

Seit v10.92 existiert für „Standortbeschreibung / Montagehinweise“ eine Spracheingabe.

Browserseitig wird verwendet:

- `SpeechRecognition`
- bzw. `webkitSpeechRecognition`
- Sprache: `de-AT`

Der erkannte Text wird in das Montagehinweis-Feld eingefügt.

Die Funktion hängt von der Browserunterstützung und Mikrofonberechtigung ab.

---

## 12. „Professionell formulieren“

Seit v10.93 existiert die Schaltfläche:

**✨ Professionell formulieren**

Diese Funktion ist derzeit bewusst **keine externe generative KI**.

Sie:

- läuft lokal im Browser
- verwendet feste Text-/Begriffsregeln
- benötigt keine API
- verursacht keine laufenden API-Kosten
- zeigt zuerst einen Vorschlag
- der Benutzer kann abbrechen oder übernehmen

Wichtig: Maße und Zahlen sollen nicht erfunden oder eigenmächtig verändert werden.

Eine echte KI-Funktion könnte später über einen abgesicherten Backend-/API-Service ergänzt werden. API-Schlüssel dürfen nicht direkt in den öffentlichen GitHub-Pages-Frontendcode eingebaut werden.

---

## 13. Solar

Die Solar-Auswahl ist aktuell standardmäßig auf **Ja** vorgesehen.

Das Solarpanel befindet sich auf dem Hauptkasten.

---

## 14. Querformat / Fotoauslöser

Für mobile Nutzung wurde der Fotoauslöser angepasst:

- Hochformat: unten mittig
- Querformat auf mobilen Geräten: rechts mittig

Dies erleichtert die Bedienung während der Standortaufnahme.

---

## 15. Google Sheets / Apps Script

Die Standortdaten werden über den bestehenden Google-Sheets-/Apps-Script-Flow verarbeitet.

Spreadsheet:

**Tamburi Standortbesichtigungen**

Spreadsheet-ID:

`1mf4o0iTdY1e1HYP_vULmy4e5KWvwBKg4yO9VFR4paoQ`

Apps-Script-Web-App:

`https://script.google.com/macros/s/AKfycby9N5ZygYPfmUNHYnCaO0lFTsXJ86G0Xq3BEsf8qJv0LD72ckeMOIobFGGMJk2WMK-24g/exec`

Wichtig:

- produktive Web-App verwendet `/exec`
- nicht auf `/dev` umstellen
- vor Änderungen Datenstruktur und Foto-Paarung prüfen
- keine geheimen Zugangsdaten im Repository hinterlegen

---

## 16. „Neuer Standort“

Die Anwendung besitzt eine Funktion zum Start eines neuen Standorts.

Diese muss unter anderem verhindern, dass Daten/Fotos/Varianten des vorherigen Standorts unabsichtlich weiterverwendet werden.

Bei Änderungen am State-Management insbesondere testen:

- Adresse
- Foto-/Rendering-Paare
- Varianten
- Modellzustand
- temporäre Daten
- lokale/sessionbezogene Zustände

---

## 17. Versionshistorie – technisch relevante Punkte

### v10.85

Betonsockel-Geometrie wurde auf den gewünschten Stand gebracht.

### v10.86

Prozedurales Three.js-Modell wurde in den bestehenden AR-/model-viewer-Workflow integriert.

### v10.87 / v10.88 / v10.89

Bereinigung alter Flow-/Versionslogik. Dabei gab es unter anderem Konflikte durch Legacy-Skripte und einen Bootstrap-Fehler.

### v10.90

„Neuer Standort“ wiederhergestellt und Modell-Synchronisation weiter bearbeitet. Teilweise wurde dennoch das alte 3D-Modell angezeigt.

### v10.91

Wichtiger Stabilitätsstand:

- Three.js/`GLTFExporter` auf `esm.sh`
- generiertes Modell wurde autoritativ
- Synchronisation der verschiedenen `model-viewer`-Ziele
- Kamera wartet auf Modellgenerierung
- MutationObserver schützt vor Rücksetzung auf alte GLBs

### v10.92

- einheitlichere Versionsanzeige
- Solar standardmäßig Ja
- Spracheingabe
- Fotoauslöser im Querformat rechts

### v10.93

- lokale Funktion „Professionell formulieren“
- keine externe KI/API
- 3D-Geometrie gegenüber v10.92 unverändert

### v10.94

Versuch mit Standblechen. **Zurückgerollt. Nicht als produktive Grundlage verwenden.**

---

## 18. Bekannte / geplante Erweiterungen

Unter anderem vorgesehen:

- korrekte seitliche Standfüße/Standbleche
- Ausbau der Standortdokumentation
- Genossenschaft/Hausverwaltung als fachliche Information
- GPS-Koordinaten dauerhaft mitführen
- Adresse nach automatischer Ermittlung weiterhin editierbar
- Standort bereits vor Fotoaufnahme abrufbar
- Reset-Button im Kameramodus für Position, Größe und Schwenkung des Kastens
- OneDrive-Übergabe
- Funktion „Alle Varianten teilen“
- weitere Dokumentations-/Exportfunktionen
- optional Katasterunterstützung bei unklaren Grundstücksgrenzen

Eine digitale Größen-/Perspektivhilfe ist aktuell nicht zwingend vorgesehen. In der Praxis wird vor Ort ein Maßband auf den Boden gelegt, an dem die Kastengröße visuell ausgerichtet werden kann.

---

## 19. Hinweise für Refactoring

Das Projekt ist historisch gewachsen. Ein sauberer technischer Neuaufbau kann sinnvoll sein, sollte aber nicht gleichzeitig mit Funktionsänderungen erfolgen.

Empfohlene Vorgehensweise:

1. aktuellen v10.93-Stand als funktionierende Referenz sichern
2. bestehenden Foto-/Rendering-Workflow vollständig dokumentieren/testen
3. State-Management zentralisieren
4. Modellgenerierung in ein klar abgegrenztes Modul überführen
5. Kamera-/Capture-Code modularisieren
6. Google-Sheets-/Upload-Logik trennen
7. Legacy-Dateien erst entfernen, wenn ihre Funktion definitiv nicht mehr benötigt wird
8. danach UI schrittweise bereinigen

Besonders vorsichtig mit:

- `viewer.src`
- mehreren `model-viewer`-Instanzen
- Kamera-Start
- Blob-URLs der prozeduralen GLBs
- Original-/Rendering-Paarung
- alten Flow-Skripten
- Versionsmarkierungen aus mehreren Dateien

---

## 20. Testcheckliste nach Änderungen

Mindestens testen:

- Anwendung startet auf Smartphone
- 1 Kasten
- 2 Kästen
- 3 Kästen
- normale Aufstellung
- 50-cm-Platten
- 100-cm-Platten
- Betonsockel
- Solar
- Kamera öffnen/schließen
- Modell im Kameramodus sichtbar
- Modell positionieren, skalieren und drehen
- Originalfoto
- Rendering
- mehrere Varianten
- Standortdaten
- Spracheingabe
- „Professionell formulieren“
- Übermittlung an bestehenden Datenflow
- „Neuer Standort“
- Hochformat
- Querformat
- Reload/Cache-Verhalten über GitHub Pages

---

## 21. Deployment

Das Projekt wird über **GitHub Pages** aus dem Repository `JosefLab/tamburi-ar` bereitgestellt.

Bei Frontendänderungen beachten:

- Browser- und GitHub-Pages-Caching kann dazu führen, dass Benutzer kurzfristig eine ältere Version sehen.
- Deshalb werden bei wichtigen Script-/iframe-Änderungen Versionsparameter/Cache-Buster verwendet.
- Nach Deployment sowohl mit normalem Reload als auch mit frischem Cache-Buster testen.

---

## 22. Zusammenarbeit / Git

Für die Übergabe an Alex empfiehlt sich zunächst Collaborator-Zugriff auf das Repository. Das Repository kann dadurch weiterhin beim bisherigen Eigentümer bleiben, während Alex Änderungen klonen, bearbeiten und pushen kann.

Für größere Änderungen empfiehlt sich:

- eigener Branch
- nachvollziehbare Commit-Messages
- funktionierenden `main`-Stand nicht unnötig überschreiben
- größere Refactorings über Pull Request
- vor Änderungen an produktiven Abläufen Backup/Tag des funktionierenden Standes

---

## 23. Wichtigster Grundsatz

Der derzeitige Stand ist eine funktionierende Arbeitsanwendung, die im realen Standortbesichtigungsprozess eingesetzt wird.

Daher gilt:

> **Funktionierende Arbeitsabläufe zuerst erhalten, danach technisch verbessern.**

Insbesondere Kamera, 3D-Modell, Foto-Paarung und Datenübertragung sollten nicht gleichzeitig grundlegend umgebaut werden.

---

## Ansprechpartner / Übergabe

Diese Dokumentation dient als technischer Einstieg für **Alex** und soll ihm ermöglichen, die bisherige Entwicklung schneller nachzuvollziehen.

Bei Unklarheiten sollte der bestehende v10.93-Stand als Referenz für das gewünschte Verhalten verwendet werden.
