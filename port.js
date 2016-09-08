"use strict";
/*
   Copyright (C) 2016 by Oliver Gutierrez <ogutsua@gmail.com>

   This file is part of spice-html5.

   spice-html5 is free software: you can redistribute it and/or modify
   it under the terms of the GNU Lesser General Public License as published by
   the Free Software Foundation, either version 3 of the License, or
   (at your option) any later version.

   spice-html5 is distributed in the hope that it will be useful,
   but WITHOUT ANY WARRANTY; without even the implied warranty of
   MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
   GNU Lesser General Public License for more details.

   You should have received a copy of the GNU Lesser General Public License
   along with spice-html5.  If not, see <http://www.gnu.org/licenses/>.
*/

/*----------------------------------------------------------------------------
**  SpiceCursorConn
**      Drive the Spice Cursor Channel
**--------------------------------------------------------------------------*/
function SpicePortConn()
{
    DEBUG > 0 && console.log(
      'SPICE port: created SPICE port channel. Args:', arguments);

    SpiceConn.apply(this, arguments);
    this.port_name = null;
}

SpicePortConn.prototype = Object.create(SpiceConn.prototype);

SpicePortConn.prototype.process_channel_message = function(msg)
{
  if (msg.type == SPICE_MSG_PORT_INIT)
  {
    if (this.port_name === null) {
      var m = new SpiceMsgPortInit(msg.data);
      this.portName = new TextDecoder('utf-8').decode(new Uint8Array(m.name));
      this.portOpened = m.opened

      DEBUG > 0 && console.log(
        'SPICE port: Port', this.portName, 'initialized');

      return true;
    }

    DEBUG > 0 && console.log(
      'SPICE port: Port', this.port_name, 'is already initialized.');
  }
  else if (msg.type == SPICE_MSG_PORT_EVENT)
  {
    DEBUG > 0 && console.log(
      'SPICE port: Port event received for', this.portName, msg);

    var event = new CustomEvent("spice-port-event", {
			detail: {
        channel: this,
				spiceEvent: new Uint8Array(msg.data)
			},
			bubbles: true,
			cancelable: true
		});

    window.dispatchEvent(event);
    return true;
  }
  else if (msg.type == SPICE_MSG_SPICEVMC_DATA)
  {
    DEBUG > 0 && console.log(
      'SPICE port: Data received in port', this.portName, msg);

    var event = new CustomEvent("spice-port-data", {
			detail: {
        channel: this,
				data: msg.data
			},
			bubbles: true,
			cancelable: true
		});

    window.dispatchEvent(event);
    return true;
  }
  else
  {
    DEBUG > 0 && console.log(
      'SPICE port: SPICE message type not recognized:', msg)
  }

  return false;
};

function SpiceMsgPortInit(a, at)
{
    this.from_buffer(a,at);
};

SpiceMsgPortInit.prototype =
{
    from_buffer: function (a, at)
    {
      at = at || 0;
      var dv = new SpiceDataView(a);
      var namesize = dv.getUint32(at, true); at += 4;
      var offset = dv.getUint32(at, true); at += 4;
      this.opened = dv.getUint8(at, true); at += 1;
      this.name = a.slice(offset, offset + namesize - 1);
    }
}

window.addEventListener('spice-port-data', function(event) {
  var msg_text = new TextDecoder('utf-8').decode(
    new Uint8Array(event.detail.data));
  console.log(
    'SPICE port', event.detail.channel.portName, 'message text:', msg_text)
})

window.addEventListener('spice-port-event', function(event) {
  console.log(
    'SPICE port', event.detail.channel.portName, 'event data:', event.detail.spiceEvent)
})
