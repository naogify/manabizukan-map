#!/usr/bin/env node

const fs = require('fs');
const path = require('path');
const csv2geojson = require('csv2geojson');

const csvPath = path.join(__dirname, '../public/data.csv');
const geojsonPath = path.join(__dirname, '../public/data.geojson');
let categoryIconMapping = fs.readFileSync(path.join(__dirname, '../src/App/utils/iconMapping.json'), 'utf-8')
categoryIconMapping = JSON.parse(categoryIconMapping);

const csv = fs.readFileSync(csvPath, 'utf-8');

csv2geojson.csv2geojson(csv, {
  delimiter: ','
}, (err, geojson) => {
  if (err) {
    console.error(err);
    return;
  }

  const filteredFeatures = geojson.features = geojson.features.filter(feature => {
    const isPublish = '0'
    // TODO: キー名 nyuryoku_flg から BOM（U+feff） を削除
    return feature.properties.nyuryoku_flg === isPublish || feature.properties["﻿nyuryoku_flg"] === isPublish;
  });

  if (filteredFeatures.length === 0) {
    console.error('No data');
    return;
  }

  filteredFeatures.forEach((feature, index) => {

    if (!feature.properties.id) {
      feature.properties.id = `${index}`;
    }

    // start_date と end_date のフォーマット 2023-06-06T00:00:00.000Z を 2023-06-06 に変換
    if (feature.properties.start_date) {
      feature.properties.start_date = feature.properties.start_date.slice(0, 10);
    }

    if (feature.properties.end_date) {
      feature.properties.end_date = feature.properties.end_date.slice(0, 10);
    }

    if (feature.properties.category) {
      feature.properties["marker-symbol"] = categoryIconMapping[feature.properties.category];
    }

    if (feature.geometry.type === 'Point') {
      feature.properties.lat = feature.geometry.coordinates[1];
      feature.properties.lon = feature.geometry.coordinates[0];
    }
  });

  geojson.features = filteredFeatures;

  fs.writeFileSync(geojsonPath, JSON.stringify(geojson));
});
