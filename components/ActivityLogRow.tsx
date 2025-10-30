
import React from 'react';
import { ActivityLog, ActivityType } from '../types';
import { SuccessIcon, FailedIcon, ClaimIcon } from './icons/ActivityIcons';

interface ActivityLogRowProps {
    activity: ActivityLog;
}

const activityConfig = {
    [ActivityType.SUCCESS]: {
        Icon: SuccessIcon,
        color: 'text-green-400',
        pointColor: 'text-green-400',
        pointPrefix: '+',
    },
    [ActivityType.FAILED]: {
        Icon: FailedIcon,
        color: 'text-red-400',
        pointColor: '',
        pointPrefix: '',
    },
    [ActivityType.CLAIM]: {
        Icon: ClaimIcon,
        color: 'text-yellow-400',
        pointColor: 'text-red-400',
        pointPrefix: '',
    },
};

const ActivityLogRow: React.FC<ActivityLogRowProps> = ({ activity }) => {
    const config = activityConfig[activity.type];

    return (
        <div className="flex items-center gap-4 p-3 bg-gray-800 rounded-lg">
            <div className={`flex-shrink-0 ${config.color}`}>
                <config.Icon className="w-6 h-6" />
            </div>
            <div className="flex-grow">
                <p className="text-sm text-white font-medium">{activity.description}</p>
                <p className="text-xs text-gray-400">{activity.date}</p>
            </div>
            {activity.points !== undefined && (
                <div className={`text-sm font-bold ${config.pointColor}`}>
                    {config.pointPrefix}{activity.points.toLocaleString()}
                </div>
            )}
        </div>
    );
};

export default ActivityLogRow;
