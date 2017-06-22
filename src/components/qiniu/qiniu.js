'use strict';
var React = require('react');
var Qiniu = require('react-qiniu');
var ApiFactory = require('../ApiFactory.js');

module.exports = React.createClass({
   getInitialState: function getInitialState() {
        return {
            files: [],
            token:"MTCYw9bEsM_F3X3N3GPwf-eVl7WpTSNmVbM7vtCh:kSfoPnf_zBtG9OlKgt6wZOsQuAo=:eyJzY29wZSI6ImRydWciLCJkZWFkbGluZSI6MTQ4MTMzMzk3M30="
        };
    },


    onUpload: function(files) {
        // set onprogress function before uploading
        files.map(function(f) {
            f.onprogress = function(e) {
                console.log(e.percent);
            };
        });
        console.log(files);
    },

    onDrop: function(files) {
        this.setState({
            files: files
        });
        console.log('Received files: ', files);
    }, 

    render: function() {
        return (
            <div>
            <Qiniu onDrop={this.onDrop} size={150} token={this.state.token} uploadKey={this.state.uploadKey} onUpload={this.onUpload}>
              <div>点击上传</div>
            </Qiniu>
          </div>
        );
    }
});
