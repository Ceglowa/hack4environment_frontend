import logo from './logo.svg';
import './App.css';
import { MapContainer, TileLayer, Marker, Popup, Polygon, GeoJSON, FeatureGroup, CircleMarker } from 'react-leaflet'
import { useCallback, useState } from 'react';
import points from './points';
import L from 'leaflet'
import hulls from './hulls'
import Sidebar from "react-sidebar";

const center = [50.72698333, -1.74063611]
const purpleOptions = { color: 'purple' }


function Hull() {
  const onEachFeature = (feature, layer) => {
    layer.on({
      click: () => clickToFeature(feature, layer)
    });
  }

  const clickToFeature = (feature, layer) => {
     setOpenPanel(true);
     setClusterID(feature.properties.cluster); 
     setData(feature.properties.trash_data);
     setTrashCount(feature.properties.trash_count);
     console.log("I clicked on " , feature.properties.cluster);
  }
 
  const styl = (geoJsonFeature) => {
    let color = geoJsonFeature.properties.color
    if (!color){
      color = "blue"
    }
    console.log(color)
    return {
      color: color
    }
  }
  
  return <FeatureGroup>
    <GeoJSON    
      data={hulls}
      onEachFeature={onEachFeature}
      style = {styl}
    />
    <Popup>Popup in FeatureGroup</Popup>
  </FeatureGroup>
}
function App() {
  const markerOptions = {
    radius: 0.5
  }
  
  const imageHover = (ev) => {
    console.log(ev.target.feature.properties.photo_id)
  }

  const pointToLayer = (geoJsonPoint, latlng) => {
    const marker = L.circleMarker(latlng, markerOptions)
    const extArr = geoJsonPoint.properties.filename.split(".")
    const ext = extArr[extArr.length - 1]
    const url = "http://localhost:8080/" + geoJsonPoint.properties.photo_id + "." + ext;
    
    // const popupContent = document.createElement("img");
    const popupContent = "<div><img class='popup-image' src="+ url + "/></div>"
    // popupContent.src = url;
    marker.bindPopup(popupContent, {
      minWidth: "300px"
    })
    marker.on('mouseover', () => {
      console.log(popupContent);
      marker.openPopup();
    })
    marker.on('mouseout', () => marker.closePopup())
    return marker
  }

  const onSetSidebarOpen = (open) => {
    this.setState({ sidebarOpen: open });
  }

  const [visible, setVisible] = useState(false);
  
  const [openPanel, setOpenPanel] = useState(false);
  const [clusterID, setClusterID] = useState(0);
  const [clusterData, setData] = useState([]);
  const [trashCount, setTrashCount] = useState(0);

  return (
    <div className="App">
      <MapContainer center={center} zoom={20} scrollWheelZoom={false} style={{height : '100vh'}}>
        <TileLayer
          attribution='&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        <Marker position={[51.505, -0.09]}>
          <Popup>
            A pretty CSS3 popup. <br /> Easily customizable.
          </Popup>
        </Marker>
        <Hull></Hull>
        <FeatureGroup>
          <GeoJSON
            data={points} pointToLayer={pointToLayer}>
            </GeoJSON>
        </FeatureGroup>
      </MapContainer>

      <SlidingPanel
        type={'right'}
        isOpen={openPanel}
        size={30}
      >
        <div className="panel-container">
          <p> CLuster iddd</p>
          <Table
            columns={columns}
            data={clusterData}
            tableLayout="auto"
          />
          <p></p>
          <button onClick={() => setOpenPanel(false)}>close</button>

        </div>
      </SlidingPanel>
    </div>
  );
}

export default App;
