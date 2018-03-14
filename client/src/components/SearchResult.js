import React, { Component } from 'react'
import { connect } from 'react-redux';
import { FlatButton, Paper} from 'material-ui';
import moment from 'moment';
import randomHour from 'random-hour';
import _ from 'lodash';

import { } from '../actions'; 

class SearchResult extends Component {

  componentDidMount() {
    if (this.props.appmnt.length === 0) {
      this.props.history.push('/search');
    }
  }

  showBody = (userinfo, time) => {
    time = _.compact(time);
    const unix = time.map(each => {
      return each.valueOf();
    })
    this.props.history.push({
      pathname: '/doctor/details',
      state: { userinfo, time: unix }
    });
  }

  momentRandom = (end = moment(), start) => {
    const endMoment = moment(end);
    const randomNumber = (to, from = 0) =>
      Math.floor(Math.random() * (to - from) + from);
  
    if (start) {
      const startMoment = moment(start);
      if (startMoment.unix() > endMoment.unix()) {
        throw new Error('End date is before start date!');
      }
      return moment.unix(randomNumber(endMoment.unix(), startMoment.unix()));
    } else {
      return moment.unix(randomNumber(endMoment.unix()));
    }
  }
  

  renderSearchResult() {
    if (this.props.appmnt) {
      const numberOfAppts = this.props.appmnt.length * 4;
      let randomDates = [];
      for (let i = 0; i < numberOfAppts; i++) {
        let random = this.momentRandom(moment().add(14, 'days'), moment());
        let rh = randomHour({ twentyFour: true, min: 9, max: 17 });
        random.set('hour', rh);
        let oclock = randomHour({ min: 1, max: 2 });
        oclock !== 1 ? random.set('minute', 0) : random.set('minute', 30);
        randomDates.push(random);
      }

      randomDates.sort((left, right) => {
        return moment.utc(left).diff(moment.utc(right))
      })
      return (
        <ul>{
          this.props.appmnt.map((app, idx) => {
            const { profile, practice, visit_address } = app
            const { first_name, last_name, title } = profile; 
            const { street, city, state, zip } = visit_address;
            return (
              <Paper zDepth={1} style={{padding: '20px', marginBottom: '10px'}} >
                <div className="row" id={app.uid} >
                  <div className="col s2">
                    {`${first_name} ${last_name}, ${title}`}
                  </div>
                  <div className="col s3">
                    {`${practice.name}`}
                  </div>
                  <div className="col s3">
                    {`${street}, ${city}, ${state} ${zip}`}
                  </div>
                  <div className="col s3">
                    {randomDates[idx].format("MMM DD YYYY HH:mm")}
                  </div>
                  <div className="col s1">
                    <FlatButton style={{minWidth: '20px'}}
                      icon={<i className="material-icons">arrow_forward</i>}
                      onClick={this.showBody.bind(this, app, [randomDates[idx], randomDates[10 + idx ], randomDates[20 + idx]])}
                    />
                  </div>
                </div>
              </Paper>
            )
          })
        }</ul>
      )
    } else {
      return <div>Please wait</div>
    }
  }

  render() {
    return (
      <div className="container" style={{paddingTop: '20px'}}>
        <div className="row center" style={{fontSize: '20px'}} >
          <div className="col s2">
            Doctor Name
          </div> 
          <div className="col s3">
            Clinic Name
          </div> 
          <div className="col s3">
            Address
          </div> 
          <div className="col s2">
            Earliest time for appointment
          </div> 
          <div className="col s2">
          </div> 
        </div>
        {this.renderSearchResult()}
      </div>
    )
  }
}

const mapStateToProps = ({ appointments }) => {
  return { appmnt: appointments };
}

export default connect(mapStateToProps)(SearchResult);
