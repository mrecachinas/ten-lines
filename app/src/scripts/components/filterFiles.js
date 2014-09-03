
/** @jsx React.DOM */

var React = require('react/addons');
var Fluxxor = require('fluxxor');
var FluxChildMixin = Fluxxor.FluxChildMixin(React);
var StoreWatchMixin = Fluxxor.StoreWatchMixin('FilterStore');
var cx = React.addons.classSet;

// A component to unify things that get red strikethrus when hovered
var XHover = React.createClass({
    render: function() {
        return this.transferPropsTo(
            <span className="x-hover tooltip-right">
                {this.props.children}
            </span>
        );
    }
});

var FilterFiles = React.createClass({
    mixins: [FluxChildMixin, StoreWatchMixin],

    getStateFromFlux: function() {
        var flux = this.getFlux();
        return flux.store('FilterStore').getState();
    },

    filterName:  function(e) {
        var username = e.target.value.length ? e.target.value : false;
        this.getFlux().actions.filter.userFilter(username);
    },

    filterSize: function(e) {
        var size = e.target.value;
        this.getFlux().actions.filter.sizeFilter(size);
    },

    render: function() {
        var self = this;
        var actions = self.getFlux().actions.filter;
        var filtered = this.state.filtered || [];

        var files = map(function(obj) {
            var filter = actions.addFilter.bind(null, obj.filename);
            var name = obj.filename.split('/');
            if (name.length > 1) {
                name = last(name);
            }

            return (
                <li>
                    <XHover onClick={filter} data-tooltip={obj.filename}>
                        {name}: {obj.contents.length}
                    </XHover>
                </li>
            );
        }, filtered);

        var upperLimit = max(map(size, pluck('contents', this.state.filtered)));
        var step = upperLimit / 100;


        var extensions = compose(
            uniq,
            map(function(obj) { return obj.filename.split('.').pop(); })
        )(filtered);

        extensions = map(function(ext) {
            var filter = actions.addExtension.bind(null, ext);

            return (
                <li>
                    <XHover onClick={filter}>
                        *.{ext}
                    </XHover>
                </li>
            );
        }, extensions);

        return (
            <div>
                <h1>Filters</h1>
                {self.state.active
                    ? <strong onClick={actions.resetFilters}>reset</strong>
                    : <span onClick={actions.resetFilters}>reset</span>}

                <h2>Username</h2>
                <input
                    type="text"
                    placeholder="username"
                    value={this.state.username}
                    onKeyPress={this.filterName} />

                <h2>File Size</h2>
                <input
                    type="range"
                    min="1"
                    value={this.state.fileSize}
                    max={upperLimit}
                    step={step}
                    onMouseUp={this.filterSize} />
                {this.state.fileSize}

                <h2>Extensions</h2>
                <ul> {extensions} </ul>

                <h2>Files</h2>
                <ul> {files} </ul>
            </div>
        );
    }
});

module.exports = FilterFiles;
