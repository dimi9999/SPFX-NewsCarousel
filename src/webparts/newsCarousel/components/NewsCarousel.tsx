import * as React from 'react';
import { INewsCarouselProps } from './INewsCarouselProps';
import AwesomeSlider from 'react-awesome-slider';
import withAutoplay from 'react-awesome-slider/dist/autoplay';
import 'react-awesome-slider/dist/styles.css';
import { SPHttpClient, SPHttpClientResponse } from '@microsoft/sp-http';
import $ from "jquery";
import './NewsCarousel.css';
import { useState, useEffect } from 'react';
import { PrimaryButton,FontIcon,mergeStyles } from 'office-ui-fabric-react';

const AutoplaySlider = withAutoplay(AwesomeSlider);
const iconClass = mergeStyles({
  fontSize: 12,
  height: 12,
  width: 12,
  margin: '0 5px',
});

const slider = (
  <AutoplaySlider
    play={false}
    cancelOnInteraction={false} // should stop playing on user interaction
    interval={6000}
    animation="openAnimation">
      <div key={0}></div>
      <div key={1}></div>
      <div key={2}></div>
      <div key={3}></div>
      <div key={4}></div>
    {/* <div key={0}
    // data-src="https://cdn.pixabay.com/photo/2016/10/22/20/34/wines-1761613_960_720.jpg"
    //   className="image__description"
    >
      <img width="800px" height="500px" src="https://cdn.pixabay.com/photo/2016/11/29/15/05/drink-1870139_960_720.jpg"></img>
      <h3>Lorem Ipsum</h3>
      <p>
        Lorem Ipsum is simply dummy text of the printing and typesetting
        industry.
      </p><button onClick={() => $('[data-index="1"]').click()}>
        Click
      </button>
    </div>
    <div key={1}
      // data-src="https://cdn.pixabay.com/photo/2016/10/22/20/34/wines-1761613_960_720.jpg"
      // className="image__description"
    >
         <img src="https://cfcloud.sharepoint.com/_api/v2.1/sites/cfcloud.sharepoint.com,eead849b-aaf8-4e8a-a773-42f6b6afa15e,75a1b6fc-ae98-43fa-940b-d20bbdf886cc/items/e985dd7e-62c6-41ca-98c7-dbb5106fa23d/driveItem/thumbnails/0/c400x99999/content?preferNoRedirect=true"></img>
      <h3>Lorem Ipsum</h3>
      <p>
        Lorem Ipsum is simply dummy text of the printing and typesetting
        industry.
      </p>
    </div>
    <div key={2}
      data-src="https://cdn.pixabay.com/photo/2013/11/12/01/29/bar-209148_960_720.jpg"
      className="image__description"
    >
      <h3>Lorem Ipsum</h3>
      <p>
        Lorem Ipsum is simply dummy text of the printing and typesetting
        industry.
      </p>
    </div>
    <div key={3}
      data-src="https://cdn.pixabay.com/photo/2013/11/12/01/29/bar-209148_960_720.jpg"
      className="image__description"
    >
      <h3>Lorem Ipsum</h3>
      <p>
        Lorem Ipsum is simply dummy text of the printing and typesetting
        industry.
      </p>
    </div>
    <div key={4}
      data-src="https://cdn.pixabay.com/photo/2013/11/12/01/29/bar-209148_960_720.jpg"
      className="image__description"
    >
      <h3>Lorem Ipsum</h3>
      <p>
        Lorem Ipsum is simply dummy text of the printing and typesetting
        industry.
      </p>
    </div> */}
  </AutoplaySlider>
);


const NewsCarousel = (props: INewsCarouselProps) => {
  const [news, setnews] = useState([])
  useEffect(() => {
    _getListItemsFromSP()
  }, []);

  const _getListItemsFromSP = async () => {
    let query = props.context.pageContext.web.absoluteUrl + "/_api/search/query?querytext=%27Corporate  path:" + props.pathurl + "%27&rowlimit=5&trimduplicates=false&selectproperties=%27Title,OriginalPath,PictureThumbnailURL,Description,created%27&sourceid=%27" + props.resultsource + "%27";

    let Response: SPHttpClientResponse = await props.context.spHttpClient.get(query, SPHttpClient.configurations.v1, {
      headers: {
        'Accept': 'application/json;odata=nometadata',
        'odata-version': ''
      }
    });

    let result: any = await Response.json();

    let relevantResults: any = result.PrimaryQueryResult.RelevantResults;
    let resultCount: number = relevantResults.TotalRows;
    let allitems: any[] = [];
    if (resultCount > 0) {
      let key = 0;
      relevantResults.Table.Rows.forEach((row) => {
        var d=new Date(row.Cells.filter(column => column.Key == "created")[0]["Value"])
var datestring=d.getDate()+'/'+d.getMonth()+'/'+d.getFullYear();

        key++;
        let item = {} as any;//PictureThumbnailURL
        item["key"] = key;
        item["title"] = row.Cells.filter(column => column.Key == "Title")[0]["Value"];
        item["url"] = row.Cells.filter(column => column.Key == "OriginalPath")[0]["Value"];
        item["Picture"] = row.Cells.filter(column => column.Key == "PictureThumbnailURL")[0]["Value"].replace('c400x99999','c1600x99999');
        item["Description"] = row.Cells.filter(column => column.Key == "Description")[0]["Value"];
        item["created"] = datestring;
          allitems.push(item);
      });
      setnews(allitems);
    }
  }

  return news.length !== 0 ? (<AutoplaySlider
    play={true}
    cancelOnInteraction={false} // should stop playing on user interaction
    interval={6000}
    animation="openAnimation"
  >
    {news.map(function (newsart, i) {
      return     <div id="CarouselContainer">
                  
                  <div key={i} className="carousel-item">
                    <div className="carousel-image" style={{backgroundImage:'url(\''+newsart['Picture'] +'\')',backgroundSize:'cover'}} ></div>
                    <div className="contentContainer">
                      <div className="content">
                        {/* <div>{newsart['created']}</div> */}
                        <span className="date">      
                    <FontIcon aria-label="Clock" iconName="Clock" className={iconClass} /><time>{newsart['created']}</time>
                  </span>
                        <div className="title">{newsart['title']}</div>
                        <div className="description">{newsart['Description']}</div>
                        <div className="button"> <a href="{location.href=newsart['url']}">Read more</a></div>
                      </div>
                    </div>
                  </div>
                  <div className="overlay"></div>
                </div>

    })}
  </AutoplaySlider>) : slider
  // //$('[data-index="1"]').click()
  //  return slider;
};


export default NewsCarousel

