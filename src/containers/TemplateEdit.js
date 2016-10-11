import React, { Component } from 'react';
import { Template , Edit, CssView } from './';
import { connect } from 'react-redux';

import * as Actions from '../actions';

function mapStateToProps (state) {
  return { ...state};
}

class TemplateEdit extends Component {
  constructor (props) {
    super(props)
    this.showElementStyles = this.showElementStyles.bind(this);
  }
  loadTheme () {
    return $.ajax({
      url: '/api/styles',
      dataType: 'json',
    });
  }
  loadColorApi () {
    return $.ajax({
      url: "http://www.colr.org/json/colors/random/5"
    });
  }
  loadFontApi () {
    return $.ajax({
      url: "https://www.googleapis.com/webfonts/v1/webfonts?key=AIzaSyBifqNWX2_oCeWV1TZcsOZL-Sy1Q15eIIs"
    });
  }
  componentDidMount () {
    this.loadColorApi()
      .then(function (data) {
        var colorsObject = JSON.parse(data);
        var colorPalette = [];
        colorsObject.colors.map(function (elem, i) {
          var colorName = null;
          var colorHex = null;
          elem.tags.length > 0 ? colorName = elem.tags[0].name : colorName = "NO COLOR";
          elem.hex.length > 0 ? colorHex = "#" + elem.hex : colorHex = "#FFF";
          return colorPalette.push({label: colorName, value: colorHex})
        })
        return colorPalette;
      })
      .then((colors) => {
        return this.props.getColorPalette(colors)
      })
    this.loadFontApi()
      .then(function (data) {
        var fontArr = data.items;
        var fontList = [];
        fontArr
          .filter(function (elem, i) {
            return elem.category === "sans-serif" && i < 10;
          })
          .map(function (elem, i) {
            return fontList.push({family: elem.family});
          })
        return fontList;
      })
      .then((fonts) => {
        return this.props.fontTypes(fonts)
      })
    this.loadTheme()
      .then((elementArray) => {
        return elementArray[0];
      //   let divTags = elementArray.filter((elem, index) => {
      //     return elem.type === 'div';
      //   });
      //   let pTags = elementArray.filter((elem, index) => {
      //     return elem.type === 'p';
      //   });
      //   let imgTags = elementArray.filter((elem, index) => {
      //     return elem.type === 'img';
      //   });
      //   let ulTags = elementArray.filter((elem, index) => {
      //     return elem.type === 'ul';
      //   });
      //   return {
      //     divTags: divTags,
      //     pTags: pTags,
      //     imgTags: imgTags,
      //     ulTags: ulTags
      //   };
      })
      .then((elements) => {
        this.props.setElements(elements);
      })
  }

  showElementStyles(styles){
    let stylesArray = [];
    for (let style in styles) {
      stylesArray.push(`${style}: ${styles[style]},  `);
    }
    return stylesArray;
  }

  render() {
    let cssComponent = null;
    if (this.props.sideBar.showCss === true) {
      cssComponent = <CssView />;
    }
    console.log(this.props);
    return(
      <div
        className="template-edit-container"
      >
        <Template
          divTags={this.props.elementsReducer.doc.divTags}
          pTags={this.props.elementsReducer.doc.pTags}
          imgTags={this.props.elementsReducer.doc.imgTags}
          ulTags={this.props.elementsReducer.doc.ulTags}
          selectElement={this.props.selectElement}
          selectedElementId={this.props.elementsReducer.selectedElement.selectedElementId}
          selectedElementStyle={this.props.elementsReducer.selectedElement.selectedStyle}
          showElementStyles={this.showElementStyles}
        />
        <div
          className="views"
        >
          <Edit
            colorPalette={this.props.colors.colorPalette}
            fontList={this.props.fonts.items}
            changeColor={this.props.changeColor}
            changeFont={this.props.changeFont}
            selectedElement={this.props.elementsReducer.selectedElement.selectedElementId}
            selectedElementStyle={this.props.elementsReducer.selectedElement.selectedStyle}
            elements={this.props.elementsReducer.doc.elements}
            savePopup={this.props.savePopup}
            showSave={this.props.showSave}
            newDoc={this.props.newDoc}
            docId={this.props.elementsReducer.doc._id}
            doc={this.props.elementsReducer.doc}
          />
          { cssComponent }
        </div>
      </div>
    )
  }
}

export default connect(mapStateToProps, Actions)(TemplateEdit);
