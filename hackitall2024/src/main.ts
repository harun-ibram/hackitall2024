import './style.css'
import markerIcon from '../assets/mega.png'
import Papa from 'papaparse'

document.querySelector<HTMLDivElement>('#app')!.innerHTML = `
  <div id="map" class="map"></div>
`

function initMap(): void {
  const mapDiv = document.getElementById("map") as HTMLElement
  const map = new google.maps.Map(mapDiv, {
    center: { lat: 44.4268, lng: 26.1025 }, // Centered on Bucharest
    zoom: 5,
    styles: [ /* Your dark mode styles here */ ],
  })

  const markers: google.maps.Marker[] = []
  const circles: google.maps.Circle[] = []
  const infoWindows: google.maps.InfoWindow[] = []
  const isCSVs: boolean[] = [] // Tracks if a marker is from CSV

  /**
   * Adds a marker to the map with an associated InfoWindow and circle.
   * @param position - The geographical position of the marker.
   * @param name - The name/label of the marker.
   * @param isCSV - Flag indicating if the marker is added from CSV.
   * @param radius - Radius of the circle in meters.
   */
  function addMarker(position: google.maps.LatLngLiteral, name: string, isCSV: boolean = false, radius: number = 100): void {
    // Store name as a marker property for easy access and updates
    const marker = new google.maps.Marker({
      position,
      map,
      icon: {
        url: markerIcon,
        scaledSize: new google.maps.Size(24, 24),
      },
      label: undefined // No label for any markers
    })

    marker.set('name', name) // Custom property to store marker name

    let circleColor: string

    if (isCSV) {
      // For CSV markers, set circle color to blue
      circleColor = '#0000FF' // Blue
    } else {
      // For user-added markers, set initial circle color to green
      circleColor = '#00FF00' // Green
    }

    // Create InfoWindow with editable name
    const infoWindow = new google.maps.InfoWindow({
      content: `
        <div style="max-width:250px; color:black;">
          <h3 id="marker-name">${name}</h3>
          <p><strong>Coordinates:</strong> (${position.lat.toFixed(4)}, ${position.lng.toFixed(4)})</p>
          <p><strong>Description:</strong> This is a custom marker.${isCSV ? ' Added from CSV data.' : ''}</p>
          <button id="edit-name-btn">Edit Name</button>
          <div id="edit-name-section" style="display:none; margin-top:10px;">
            <input type="text" id="new-name-input" value="${name}" />
            <button id="save-name-btn">Save</button>
            <button id="cancel-edit-btn">Cancel</button>
          </div>
        </div>
      `
    })

    // Add Click Listener to Marker to Toggle InfoWindow
    marker.addListener('click', () => {
      // Close all other InfoWindows
      infoWindows.forEach(iw => iw.close())

      // Open this InfoWindow
      infoWindow.open(map, marker)

      // Add event listeners for editing name after the InfoWindow is opened
      google.maps.event.addListenerOnce(infoWindow, 'domready', () => {
        const editBtn = document.getElementById('edit-name-btn')
        const editSection = document.getElementById('edit-name-section')
        const saveBtn = document.getElementById('save-name-btn')
        const cancelBtn = document.getElementById('cancel-edit-btn')
        const nameHeader = document.getElementById('marker-name') as HTMLElement
        const nameInput = document.getElementById('new-name-input') as HTMLInputElement

        if (editBtn && editSection && saveBtn && cancelBtn && nameHeader && nameInput) {
          editBtn.addEventListener('click', () => {
            editSection.style.display = 'block'
          })

          cancelBtn.addEventListener('click', () => {
            editSection.style.display = 'none'
            nameInput.value = marker.get('name')
          })

          saveBtn.addEventListener('click', () => {
            const newName = nameInput.value.trim()
            if (newName) {
              // Update marker property
              marker.set('name', newName)
              // Update InfoWindow content
              nameHeader.textContent = newName
              // Close edit section
              editSection.style.display = 'none'
            }
          })
        }
      })
    })

    // Create Circle Around Marker with appropriate color and radius
    const circle = new google.maps.Circle({
      map,
      center: position,
      radius: radius, // Dynamic radius based on CSV
      fillColor: circleColor,
      fillOpacity: 0.35,
      strokeColor: circleColor,
      strokeOpacity: 0.8,
      strokeWeight: 2,
    })

    // Add Right-Click Listener to Remove Marker and Circle
    marker.addListener('rightclick', () => {
      marker.setMap(null) // Remove Marker
      circle.setMap(null) // Remove Circle
      infoWindow.close() // Close InfoWindow

      // Find the index of the marker to remove
      const markerIndex = markers.indexOf(marker)
      if (markerIndex > -1) {
        markers.splice(markerIndex, 1)
        circles.splice(markerIndex, 1)
        infoWindows.splice(markerIndex, 1)
        isCSVs.splice(markerIndex, 1)

        // Update circle colors for all markers after removal
        updateMarkersOverlap()
      }
    })

    // Store Instances
    markers.push(marker)
    circles.push(circle)
    infoWindows.push(infoWindow)
    isCSVs.push(isCSV)

    // Update overlaps after adding a new marker
    updateMarkersOverlap()
  }

  /**
   * Updates the circle colors for all markers based on overlapping.
   * - CSV markers remain blue unless they overlap with any other circle.
   * - User-added markers turn red if they overlap with any other circle.
   * - All overlapping circles are set to red regardless of their origin.
   */
  function updateMarkersOverlap(): void {
    // Reset all circles to their initial colors
    markers.forEach((marker, index) => {
      if (isCSVs[index]) {
        // CSV markers
        circles[index].setOptions({
          fillColor: '#0000FF', // Blue
          strokeColor: '#0000FF'
        })
      } else {
        // User-added markers
        circles[index].setOptions({
          fillColor: '#00FF00', // Green
          strokeColor: '#00FF00'
        })
      }
    })

    // Check for overlaps among all markers
    for (let i = 0; i < markers.length; i++) {
      for (let j = i + 1; j < markers.length; j++) {
        // Skip overlap check if both markers are CSV-imported (blue circles)
        if (isCSVs[i] && isCSVs[j]) {
          continue
        }

        const distance = google.maps.geometry.spherical.computeDistanceBetween(
          markers[i].getPosition()!,
          markers[j].getPosition()!
        )

        if (distance < (circles[i].getRadius() + circles[j].getRadius())) {
          // Overlapping - set both circles to red
          circles[i].setOptions({
            fillColor: '#FF0000', // Red
            strokeColor: '#FF0000'
          })
          circles[j].setOptions({
            fillColor: '#FF0000', // Red
            strokeColor: '#FF0000'
          })
        }
      }
    }
  }

  /**
   * Fetches and parses the CSV file, then adds markers based on the data.
   */
  function loadMarkersFromCSV(): void {
    fetch('../assets/data.csv') // Ensure the path is correct relative to your project structure
      .then(response => response.text())
      .then(csvText => {
        interface CSVRow {
          latitude: string
          longitude: string
          name?: string
          radius?: string // 4th field for radius
        }

        Papa.parse<CSVRow>(csvText, {
          header: true,
          skipEmptyLines: true,
          complete: function(results: Papa.ParseResult<CSVRow>) {
            results.data.forEach((row: CSVRow) => {
              const lat = parseFloat(row.latitude)
              const lng = parseFloat(row.longitude)
              const name = row.name || `Marker ${markers.length + 1}`
              const radius = row.radius ? parseFloat(row.radius) : 100 // Default to 100 if not provided

              if (!isNaN(lat) && !isNaN(lng)) {
                const position = { lat, lng }
                addMarker(position, name, true, isNaN(radius) ? 100 : radius) // Mark as CSV marker with dynamic radius
              }
            })
          }
        })
      })
      .catch(error => console.error('Error fetching CSV:', error))
  }

  /**
   * Initializes the process of loading markers from CSV.
   */
  loadMarkersFromCSV()

  /**
   * Adds event listener to allow users to add markers by clicking on the map.
   */
  map.addListener('click', (event: google.maps.MapMouseEvent) => {
    const clickedLocation = event.latLng

    if (clickedLocation) {
      const name = `Store`
      const position = { lat: clickedLocation.lat(), lng: clickedLocation.lng() }
      addMarker(position, name) // isCSV defaults to false, radius defaults to 100
    }
  })
}

/**
 * Extends the Window interface to include initMap.
 */
declare global {
  interface Window {
    initMap: () => void
  }
}

window.initMap = initMap