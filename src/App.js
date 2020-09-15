import React, { useCallback, useState } from "react";
import { DndProvider } from "react-dnd";
import HTML5Backend from "react-dnd-html5-backend";
import TouchBackend from "react-dnd-touch-backend";
import update from "immutability-helper";
import cuid from "cuid";
import { Graph } from "react-d3-graph";

//import Dropzone from "./Dropzone";
import ImageList from "./ImageList";
import { isTouchDevice } from "./utils";

import "./App.css";

const backendForDND = isTouchDevice() ? TouchBackend : HTML5Backend;
const eachCons = (array, num) => {
  return Array.from({ length: array.length - num + 1 }, (_, i) =>
    array.slice(i, i + num)
  );
};
let list = eachCons(
  [210142, 210143, 210144, 596, 210145, 210146, 210147, 210148],
  2
).map(pair => {
  return { source: pair[0], target: pair[1] };
});
list.push({ source: 210144, target: 210145 });

const images_const = [
  210142,
  210143,
  210144,
  596,
  210145,
  210146,
  210147,
  210148
].map(image => {
  return { id: image, src: `/g/g2/${image}.png` };
});
const config = {
  automaticRearrangeAfterDropNode: false,
  collapsible: false,
  directed: false,
  focusAnimationDuration: 0.75,
  focusZoom: 1,
  height: 100,
  highlightDegree: 1,
  highlightOpacity: 1,
  linkHighlightBehavior: true,
  maxZoom: 1,
  minZoom: 1,
  nodeHighlightBehavior: true,
  panAndZoom: false,
  staticGraph: false,
  staticGraphWithDragAndDrop: true,
  width: images_const.length * 100 + 200,
  d3: {
    alphaTarget: 0.05,
    gravity: -400,
    linkLength: 180,
    linkStrength: 1,
    disableLinkForce: true
  },
  node: {
    color: "blue",
    fontColor: "black",
    fontSize: 12,
    fontWeight: "normal",
    highlightColor: "SAME",
    highlightFontSize: 12,
    highlightFontWeight: "bold",
    highlightStrokeColor: "blue",
    highlightStrokeWidth: "SAME",
    labelProperty: "name",
    mouseCursor: "pointer",
    opacity: 1,
    renderLabel: true,
    size: 500,
    strokeColor: "none",
    strokeWidth: 2,
    svg: "",
    symbolType: "circle"
  },
  link: {
    color: "#d3d3d3",
    fontColor: "black",
    fontSize: 12,
    fontWeight: "normal",
    highlightColor: "blue",
    highlightFontSize: 8,
    highlightFontWeight: "bold",
    labelProperty: "label",
    mouseCursor: "pointer",
    opacity: 1,
    renderLabel: true,
    semanticStrokeWidth: true,
    strokeWidth: 1.5,
    markerHeight: 6,
    markerWidth: 6,
    type: "CURVE_SMOOTH"
  }
};

const data_const = {
  links: list,
  nodes: [210142, 210143, 210144, 596, 210145, 210146, 210147, 210148].map(
    (image, index) => {
      return { id: image, name: image, x: index * 100 + 100, y: 50 };
    }
  )
};

function App() {
  const [images, setImages] = useState(images_const);
  const [data, setData] = useState(data_const);
  const onDrop = useCallback(acceptedFiles => {
    acceptedFiles.map(file => {
      const reader = new FileReader();
      reader.onload = function(e) {
        setImages(prevState => [
          ...prevState,
          { id: cuid(), src: e.target.result }
        ]);
      };
      reader.readAsDataURL(file);
      return file;
    });
  }, []);

  const moveImage = (dragIndex, hoverIndex) => {
    const draggedImage = images[dragIndex];
    setImages(
      update(images, {
        $splice: [
          [dragIndex, 1],
          [hoverIndex, 0, draggedImage]
        ]
      })
    );
  };

  const onDoubleClickNode = function(nodeId) {
    //let modData = { ...reactRef.state.data };
    let modData = data;
    let selectNode = modData.nodes.filter(item => {
      return item.id === nodeId;
    });
    selectNode.forEach(item => {
      if (item.color && item.color === "red") item.color = "blue";
      else item.color = "red";
    });
    console.log(selectNode);
    setData(modData);
    //    reactRef.setState({ data: modData });
  };

  return (
    <main className="App">
      {/*<h2 className="text-center">Graph Genome Browser Example</h2>*/}
      {/*<Dropzone onDrop={onDrop} accept={"image/*"} />*/}
      {/*images && images.length > 0 && (
        <h3 className="text-center">Drag the Images to change positions</h3>
      )*/}
      <Graph
        id="graph-id" // id is mandatory, if no id is defined rd3g will throw an error
        onDoubleClickNode={onDoubleClickNode}
        data={data}
        config={config}
      />
      <DndProvider backend={backendForDND}>
        <ImageList images={images} moveImage={moveImage} />
      </DndProvider>
    </main>
  );
}

export default App;
