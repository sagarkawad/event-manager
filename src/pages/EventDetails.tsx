import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { format } from 'date-fns';
import { MapPin, Calendar, Clock, Users } from 'lucide-react';
import { getEvents, toggleAttendance } from '../lib/api';
import { useAuth } from '../contexts/AuthContext';
import { toast } from 'react-hot-toast';
import type { Event } from '../types/database';

export default function EventDetails() {
  const { id } = useParams<{ id: string }>();
  const { user } = useAuth();
  const [event, setEvent] = useState<Event | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchEvent() {
      if (!id) return;

      try {
        const events = await getEvents();
        const foundEvent = events.find(e => e._id === id);
        setEvent(foundEvent || null);
      } catch (error) {
        console.error('Failed to fetch event:', error);
        toast.error('Failed to load event details');
      } finally {
        setLoading(false);
      }
    }

    fetchEvent();
  }, [id]);

  const isAttending = event?.attendees.some(
    a => user && a.user === user.id && a.status === 'attending'
  );

  const handleAttendance = async () => {
    if (!user || !event) {
      toast.error('You must be logged in to RSVP');
      return;
    }

    try {
      const updatedEvent = await toggleAttendance(event._id);
      setEvent(updatedEvent);
      toast.success(isAttending ? 'You are no longer attending this event' : 'You are now attending this event');
    } catch (error) {
      toast.error('Failed to update attendance');
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-[50vh]">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-600"></div>
      </div>
    );
  }

  if (!event) {
    return <div className="text-center text-gray-600">Event not found</div>;
  }

  return (
    <div className="max-w-4xl mx-auto">
      <div className="bg-white rounded-lg shadow-md p-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-4">{event.title}</h1>
        
        <div className="space-y-4 mb-8">
          <div className="flex items-center text-gray-600">
            <Calendar className="h-5 w-5 mr-2" />
            <span>{format(new Date(event.startTime), 'PPP')}</span>
          </div>
          
          <div className="flex items-center text-gray-600">
            <Clock className="h-5 w-5 mr-2" />
            <span>
              {format(new Date(event.startTime), 'p')} -{' '}
              {format(new Date(event.endTime), 'p')}
            </span>
          </div>

          {event.location && (
            <div className="flex items-center text-gray-600">
              <MapPin className="h-5 w-5 mr-2" />
              <span>{event.location}</span>
            </div>
          )}

          <div className="flex items-center text-gray-600">
            <Users className="h-5 w-5 mr-2" />
            <span>{event.attendees.length} attending</span>
          </div>
        </div>

        <div className="prose max-w-none mb-8">
          <p className="text-gray-600">{event.description}</p>
        </div>

        {user && (
          <button
            onClick={handleAttendance}
            className={`w-full md:w-auto px-6 py-2 rounded-md text-sm font-medium ${
              isAttending
                ? 'bg-red-600 hover:bg-red-700 text-white'
                : 'bg-indigo-600 hover:bg-indigo-700 text-white'
            }`}
          >
            {isAttending ? 'Cancel Attendance' : 'Attend Event'}
          </button>
        )}
      </div>
    </div>
  )};