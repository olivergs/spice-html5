"use strict";
/*
   Copyright (C) 2012 by Jeremy P. White <jwhite@codeweavers.com>

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
    console.log('OLIVER: CREATED PORT CLASS WITH ARGS:', arguments)
    SpiceConn.apply(this, arguments);
}

SpicePortConn.prototype = Object.create(SpiceConn.prototype);

SpicePortConn.prototype.process_channel_message = function(msg)
{
    console.log('OLIVER: RECEIVED MESSAGE IN PORT CLASS', this.idx)

    if (msg.type == SPICE_MSG_PORT_INIT)
    {
      console.log('OLIVER: SPICE_MSG_PORT_INIT!!', msg, this.idx);
      // Read port name and set it here
      this.port_name = name;
      this.port_alias = alias;
      return true;
    }
    else if (msg.type == SPICE_MSG_PORT_EVENT)
    {
      console.log(
        'SPICE Port: Ignoring unimplemented SPICE_MSG_PORT_EVENT', this.idx);
      return true;
    }
    else if (msg.type == SPICE_MSG_SPICEVMC_DATA)
    {
      console.log('OLIVER: SPICE_MSG_SPICEVMC_DATA!!', msg, this.idx);
      // Call correspondent channel listener
      return true;
    }

    return false;
}
