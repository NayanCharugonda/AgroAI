import { useEffect, useRef, useState } from "react";

interface MapProps {
    center?: { lat: number; lng: number };
    zoom?: number;
    markers?: Array<{
        position: { lat: number; lng: number };
        title: string;
        available?: boolean;
        type?: string;
        capacity?: string;
    }>;
    onLocationDetected?: (lat: number, lng: number) => void;
}

declare global {
    interface Window {
        google: any;
    }
}

export default function Map({ center, zoom = 13, markers = [], onLocationDetected }: MapProps) {
    const mapRef = useRef<HTMLDivElement>(null);
    const googleMapRef = useRef<any>(null);
    const markersRef = useRef<any[]>([]);
    const [apiError, setApiError] = useState(false);

    useEffect(() => {
        let retryCount = 0;
        const maxRetries = 20; // 2 seconds total

        const initMap = async () => {
            if (!mapRef.current) return;

            if (!window.google || !window.google.maps) {
                if (retryCount < maxRetries) {
                    retryCount++;
                    setTimeout(initMap, 100);
                    return;
                }
                setApiError(true);
                console.error("Google Maps API not loaded. Check your API key in index.html");
                return;
            }

            // Check if the script in index.html still has the placeholder
            const scripts = document.getElementsByTagName('script');
            for (let i = 0; i < scripts.length; i++) {
                if (scripts[i].src.includes('key=YOUR_API_KEY')) {
                    setApiError(true);
                    return;
                }
            }

            let finalCenter = center || { lat: 17.385, lng: 78.4867 };

            let map = googleMapRef.current;
            
            // React 18 Strict Mode destroys the DOM on unmount but keeps the ref.
            // If the map container is empty, we must reinstantiate to avoid a blank screen!
            if (!map || mapRef.current.children.length === 0) {
                map = new window.google.maps.Map(mapRef.current, {
                    center: finalCenter,
                    zoom: zoom,
                    mapId: 'DEMO_MAP_ID', 
                    disableDefaultUI: false,
                    zoomControl: true,
                });

                googleMapRef.current = map;

                // Define a helper to draw user marker
                const drawUserMarker = (position: { lat: number, lng: number }, title: string) => {
                    new window.google.maps.Marker({
                        position: position,
                        map: map,
                        title: title,
                        icon: {
                            path: window.google.maps.SymbolPath.CIRCLE,
                            scale: 8,
                            fillColor: "#4285F4",
                            fillOpacity: 1,
                            strokeWeight: 2,
                            strokeColor: "white",
                        }
                    });
                };

                // Geolocation logic: async without blocking the map render
                if (!center && navigator.geolocation) {
                    navigator.geolocation.getCurrentPosition(
                        (position) => {
                            const userLoc = {
                                lat: position.coords.latitude,
                                lng: position.coords.longitude,
                            };
                            map.setCenter(userLoc);
                            drawUserMarker(userLoc, "Your Location");
                            if (onLocationDetected) {
                                onLocationDetected(userLoc.lat, userLoc.lng);
                            }
                        },
                        (error) => {
                            console.error("Geolocation failed:", error);
                            drawUserMarker(finalCenter, "Default Location");
                            if (onLocationDetected) {
                                onLocationDetected(finalCenter.lat, finalCenter.lng);
                            }
                        },
                        { timeout: 5000 }
                    );
                } else {
                    drawUserMarker(finalCenter, center ? "Selected Location" : "Default Location");
                    if (!center && onLocationDetected) {
                        onLocationDetected(finalCenter.lat, finalCenter.lng);
                    }
                }
            } else {
                map.setCenter(finalCenter);
                map.setZoom(zoom);
            }

            // Clear old dynamically provided markers
            markersRef.current.forEach((m) => m.setMap(null));
            markersRef.current = [];

            // Add dynamically provided markers
            markers.forEach((markerData) => {
                const marker = new window.google.maps.Marker({
                    position: markerData.position,
                    map: map,
                    title: markerData.title,
                    icon: markerData.available === false ?
                        'http://maps.google.com/mapfiles/ms/icons/red-dot.png' :
                        'http://maps.google.com/mapfiles/ms/icons/green-dot.png'
                });
                markersRef.current.push(marker);

                // Info Window for markers
                const infoWindow = new window.google.maps.InfoWindow({
                    content: `
              <div style="padding: 8px; font-family: sans-serif;">
                <h3 style="margin: 0 0 4px; font-weight: 700;">${markerData.title}</h3>
                <p style="margin: 2px 0; font-size: 13px;">${markerData.type || 'Storage'}</p>
                <p style="margin: 2px 0; font-size: 13px;">Capacity: ${markerData.capacity || 'N/A'}</p>
                <p style="margin: 4px 0; font-size: 13px; font-weight: 600; color: ${markerData.available === false ? '#dc2626' : '#16a34a'}">
                  ${markerData.available === false ? 'Full' : 'Available'}
                </p>
              </div>
            `
                });

                marker.addListener("click", () => {
                    infoWindow.open({
                        anchor: marker,
                        map,
                    });
                });
            });
        };

        initMap();
    }, [center, markers]);

    if (apiError) {
        return (
            <div className="w-full h-full min-h-[400px] flex flex-col items-center justify-center bg-muted rounded-lg border-2 border-dashed border-border p-8 text-center">
                <div className="w-12 h-12 bg-destructive/10 rounded-full flex items-center justify-center mb-4">
                    <span className="text-destructive text-2xl">⚠️</span>
                </div>
                <h3 className="text-lg font-semibold mb-2">Google Maps API Key Required</h3>
                <p className="text-sm text-muted-foreground max-w-md mx-auto mb-4">
                    To enable the interactive map and dynamic storage finder, you must provide a valid Google Maps API Key.
                </p>
                <div className="bg-card p-4 rounded border text-left text-xs font-mono max-w-full overflow-hidden">
                    <p className="mb-2 text-foreground font-semibold">Instructions:</p>
                    <ol className="list-decimal list-inside space-y-1">
                        <li>Open <code className="bg-muted px-1 rounded">index.html</code></li>
                        <li>Find <code className="bg-muted px-1 rounded">YOUR_API_KEY</code></li>
                        <li>Replace it with your API key from Google Cloud Console</li>
                    </ol>
                </div>
            </div>
        );
    }

    return <div ref={mapRef} className="w-full h-full min-h-[400px]" />;
}
