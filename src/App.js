import React, { useReducer, useState, createRef } from "react";
import { DndProvider } from "react-dnd";
import HTML5Backend from "react-dnd-html5-backend";
import TouchBackend from "react-dnd-touch-backend";
import update from "immutability-helper";
import { useScreenshot } from "use-react-screenshot";
import { Graph } from "react-d3-graph";

//import Dropzone from "./Dropzone";
import ImageList from "./ImageList";
import { isTouchDevice } from "./utils";
import "./";

import "./App.css";

const backendForDND = isTouchDevice() ? TouchBackend : HTML5Backend;
const eachCons = (array, num) => {
  return Array.from({ length: array.length - num + 1 }, (_, i) =>
    array.slice(i, i + num)
  );
};

/* User-defined information */
//const dir = "/g/g2/"
//const nodes = [210142, 210143, 210144, 596, 210145, 210146, 210147, 210148];
//const additionalEdges = [[210144, 210145]]

//const dir = "/g/g3";
//const nodes = [718590, 718591, 718592, 1326, 718593, 718594, 718595, 718596];
//const additionalEdges = [[718592, 718593]];

//const dir = "/g/g4";
//const nodes = [658283, 658284, 1240, 658285, 658286, 658287, 658288]
//const additionalEdges = [[658284, 658285]];

//const dir = "/g/g5";
//const nodes = [901119, 901120, 901121, 1607, 901122, 901123, 901124]
//const additionalEdges = [[901121, 901122]];
const prefix = ""; //"_4"

//const dir = "/g/g6";
//const nodes = [ 790075, 790076, 1442 ,1443, 1444, 790077 ,790078, 790079, 790080]
//const additionalEdges = [[790076,1443],[1443,790077]];

//const dir = "/g/g7";
//const nodes = [790068, 790069, 790070, 1440, 790071, 790072, 790073, 790074];
//const nodeLength = [255, 255, 157, 115, 256, 256, 256, 256]; // Dummy data.
//const additionalEdges = [[790070, 790071]];
/*fetch('./dnd/reads.json').then(function(response){
  console.log(response)
  return response.json();
})      .then(function(myJson) {
  console.log(myJson);
});*/
const read_max = 110;
const dir = "dnd";
const nodes = [...Array(read_max)].map((_, i) => i);

//const nodes = []

const nodeWidth = 50;
let list = eachCons(nodes, 2).map(pair => {
  return { source: pair[0], target: pair[1] };
});

function generateNode(node) {
  let node_length = 20;
  //let left_padding = (max_length - node_length) / 2;
  return (
    <div
      style={{
        width: node_length,
        height: node_length,
        marginTop: "50px",
        marginLeft: "50px",
        //transform: "translate(100,0)",
        backgroundColor: node.color
      }}
    ></div>
  );
}

const images_const = nodes.map(image => {
  return { id: image, src: `${dir}/${image}${prefix}.png`, visible: true };
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
  width: images_const.length * nodeWidth + nodeWidth,
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
    size: 1000,
    strokeColor: "none",
    strokeWidth: 2,
    svg: "",
    symbolType: "square",
    viewGenerator: generateNode
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
  nodes: nodes.map((image, index) => {
    return {
      id: image,
      name: image,
      x: index * nodeWidth,
      y: 70,
      //length: nodeLength[index],
      color: "blue"
    };
  })
};

const dataReducer = (state, action) => {
  if (action.type === "flip") {
    let modData = state.nodes;
    let selectNode = modData.filter(item => {
      return item.id === parseInt(action.nodeId);
    });
    selectNode.forEach(item => {
      if (item.color && item.color === "gray") item.color = "blue";
      else item.color = "gray";
    });
    return { ...state, nodes: modData };
  }
};

function App() {
  const [images, setImages] = useState(images_const);
  const data_const2 = JSON.stringify(images);
  const [images_str, setStr] = useState(data_const2);
  const [data, dataDispatch] = useReducer(dataReducer, data_const);
  const ref = createRef(null);
  const [image, takeScreenshot] = useScreenshot();
  const getImage = () => takeScreenshot(ref.current);

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
    setStr(JSON.stringify(images));
  };

  const flipImage = nodeId => {
    let cloneImages = images;
    let flipImage = cloneImages.filter(item => item.id === parseInt(nodeId));
    flipImage.forEach(item => {
      if (item.visible === false) item.visible = true;
      else item.visible = false;
    });

    /*setImages(
      update(images, {
        $apply: function(item) {
          console.log(item)
          if (item.id === parseInt(nodeId)) {
            if (item.visible && item.visible === false) item.visible = true;
            else item.visible = false;
            return item;
          } else {
            return item;
          }
        }
      })
    );*/
    //console.log(cloneImages);
    setImages(cloneImages);
    setStr(JSON.stringify(cloneImages));
  };

  const onDoubleClickNode = function(nodeId) {
    flipImage(nodeId);
    dataDispatch({
      type: "flip",
      nodeId
    });
  };

  return (
    <main className="App">
      <Graph
        id="graph-id" // id is mandatory, if no id is defined rd3g will throw an error
        onDoubleClickNode={onDoubleClickNode}
        data={data}
        config={config}
      />
      <div ref={ref}>
        <DndProvider backend={backendForDND}>
          <ImageList
            images={images}
            moveImage={moveImage}
            onDoubleClickNode={onDoubleClickNode}
          />
        </DndProvider>
      </div>
      <button style={{ marginBottom: "10px" }} onClick={getImage}>
        Save image
      </button>
      <div>
        <input
          type="text"
          name="atext"
          style={{ width: "100%" }}
          value={images_str}
          onChange={e =>
            setStr(
              //update(images_str,
              e.target.value
              //)
            )
          }
        />
        <button
          style={{ marginBottom: "10px" }}
          onClick={() =>
            setImages(
              //update(images,
              JSON.parse(images_str)
              //)
            )
          }
        >
          Update state
        </button>
      </div>
      <img src={image} alt={"Screenshot"} />
    </main>
  );
}

export default App;
