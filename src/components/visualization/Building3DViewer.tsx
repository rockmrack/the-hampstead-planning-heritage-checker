'use client';

import React, { useState, useRef, useEffect } from 'react';

interface Building3DProps {
  width: number; // meters
  depth: number; // meters
  height: number; // meters (existing height)
  extensionHeight?: number; // meters
  extensionDepth?: number; // meters
  extensionWidth?: number; // meters
  extensionType?: 'rear' | 'side' | 'loft' | 'basement';
  roofType?: 'flat' | 'pitched' | 'dormer';
  showExtension?: boolean;
}

const SCALE = 15; // pixels per meter

export function Building3DViewer({
  width = 6,
  depth = 10,
  height = 8,
  extensionHeight = 3,
  extensionDepth = 4,
  extensionWidth = 6,
  extensionType = 'rear',
  roofType = 'pitched',
  showExtension = true,
}: Building3DProps) {
  const [rotation, setRotation] = useState({ x: -25, y: -35 });
  const [isDragging, setIsDragging] = useState(false);
  const [lastPos, setLastPos] = useState({ x: 0, y: 0 });
  const containerRef = useRef<HTMLDivElement>(null);

  // Scale dimensions
  const scaledWidth = width * SCALE;
  const scaledDepth = depth * SCALE;
  const scaledHeight = height * SCALE;
  const scaledExtHeight = extensionHeight * SCALE;
  const scaledExtDepth = extensionDepth * SCALE;
  const scaledExtWidth = extensionWidth * SCALE;

  // Mouse handlers for rotation
  const handleMouseDown = (e: React.MouseEvent) => {
    setIsDragging(true);
    setLastPos({ x: e.clientX, y: e.clientY });
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!isDragging) return;
    
    const deltaX = e.clientX - lastPos.x;
    const deltaY = e.clientY - lastPos.y;
    
    setRotation(prev => ({
      x: Math.max(-60, Math.min(60, prev.x - deltaY * 0.5)),
      y: prev.y + deltaX * 0.5,
    }));
    
    setLastPos({ x: e.clientX, y: e.clientY });
  };

  const handleMouseUp = () => setIsDragging(false);

  // Touch handlers
  const handleTouchStart = (e: React.TouchEvent) => {
    if (e.touches.length === 1) {
      setIsDragging(true);
      setLastPos({ x: e.touches[0].clientX, y: e.touches[0].clientY });
    }
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    if (!isDragging || e.touches.length !== 1) return;
    
    const deltaX = e.touches[0].clientX - lastPos.x;
    const deltaY = e.touches[0].clientY - lastPos.y;
    
    setRotation(prev => ({
      x: Math.max(-60, Math.min(60, prev.x - deltaY * 0.5)),
      y: prev.y + deltaX * 0.5,
    }));
    
    setLastPos({ x: e.touches[0].clientX, y: e.touches[0].clientY });
  };

  // Calculate extension position based on type
  const getExtensionTransform = () => {
    switch (extensionType) {
      case 'rear':
        return `translateZ(${-scaledDepth / 2 - scaledExtDepth / 2}px) translateY(${(scaledHeight - scaledExtHeight) / 2}px)`;
      case 'side':
        return `translateX(${scaledWidth / 2 + scaledExtWidth / 2}px) translateY(${(scaledHeight - scaledExtHeight) / 2}px)`;
      case 'loft':
        return `translateY(${-scaledHeight / 2 - scaledExtHeight / 2}px)`;
      case 'basement':
        return `translateY(${scaledHeight / 2 + scaledExtHeight / 2}px)`;
      default:
        return '';
    }
  };

  // Get extension dimensions based on type
  const getExtensionDimensions = () => {
    switch (extensionType) {
      case 'side':
        return { w: scaledExtWidth, d: scaledDepth, h: scaledExtHeight };
      case 'loft':
        return { w: scaledWidth, d: scaledDepth, h: scaledExtHeight };
      case 'basement':
        return { w: scaledWidth * 0.9, d: scaledDepth * 0.9, h: scaledExtHeight };
      default:
        return { w: scaledExtWidth, d: scaledExtDepth, h: scaledExtHeight };
    }
  };

  const extDims = getExtensionDimensions();

  return (
    <div className="flex flex-col items-center gap-4">
      {/* 3D Viewer Container */}
      <div
        ref={containerRef}
        className="relative w-full h-[400px] bg-gradient-to-b from-sky-200 to-sky-100 rounded-xl overflow-hidden cursor-grab active:cursor-grabbing"
        style={{ perspective: '1000px' }}
        onMouseDown={handleMouseDown}
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
        onMouseLeave={handleMouseUp}
        onTouchStart={handleTouchStart}
        onTouchMove={handleTouchMove}
        onTouchEnd={handleMouseUp}
      >
        {/* Ground plane */}
        <div
          className="absolute left-1/2 top-1/2"
          style={{
            transform: `rotateX(${rotation.x}deg) rotateY(${rotation.y}deg) translateX(-50%) translateY(-50%)`,
            transformStyle: 'preserve-3d',
          }}
        >
          {/* Ground */}
          <div
            className="absolute bg-green-600/30"
            style={{
              width: '400px',
              height: '400px',
              transform: `rotateX(90deg) translateZ(${scaledHeight / 2}px) translateX(-200px) translateY(-200px)`,
              boxShadow: 'inset 0 0 50px rgba(0,100,0,0.3)',
            }}
          />

          {/* Main Building */}
          <div
            style={{
              width: `${scaledWidth}px`,
              height: `${scaledHeight}px`,
              transform: 'translateX(-50%) translateY(-50%)',
              transformStyle: 'preserve-3d',
              position: 'relative',
            }}
          >
            {/* Front face */}
            <div
              className="absolute bg-stone-300 border border-stone-400"
              style={{
                width: `${scaledWidth}px`,
                height: `${scaledHeight}px`,
                transform: `translateZ(${scaledDepth / 2}px)`,
              }}
            >
              {/* Windows */}
              <div className="absolute top-4 left-4 w-6 h-8 bg-blue-200 border border-stone-500" />
              <div className="absolute top-4 right-4 w-6 h-8 bg-blue-200 border border-stone-500" />
              <div className="absolute bottom-4 left-1/2 -translate-x-1/2 w-8 h-12 bg-amber-800 border border-stone-600" />
            </div>
            
            {/* Back face */}
            <div
              className="absolute bg-stone-400"
              style={{
                width: `${scaledWidth}px`,
                height: `${scaledHeight}px`,
                transform: `translateZ(${-scaledDepth / 2}px) rotateY(180deg)`,
              }}
            />
            
            {/* Left face */}
            <div
              className="absolute bg-stone-350"
              style={{
                width: `${scaledDepth}px`,
                height: `${scaledHeight}px`,
                transform: `translateX(${-scaledDepth / 2}px) rotateY(-90deg)`,
                backgroundColor: '#a8a29e',
              }}
            />
            
            {/* Right face */}
            <div
              className="absolute bg-stone-300"
              style={{
                width: `${scaledDepth}px`,
                height: `${scaledHeight}px`,
                transform: `translateX(${scaledWidth - scaledDepth / 2}px) rotateY(90deg)`,
              }}
            />
            
            {/* Roof */}
            {roofType === 'pitched' ? (
              <>
                <div
                  className="absolute bg-red-700"
                  style={{
                    width: `${scaledWidth}px`,
                    height: `${scaledDepth * 0.6}px`,
                    transform: `translateY(${-scaledHeight / 2 - scaledDepth * 0.15}px) translateZ(${scaledDepth * 0.15}px) rotateX(60deg)`,
                    transformOrigin: 'bottom center',
                  }}
                />
                <div
                  className="absolute bg-red-800"
                  style={{
                    width: `${scaledWidth}px`,
                    height: `${scaledDepth * 0.6}px`,
                    transform: `translateY(${-scaledHeight / 2 - scaledDepth * 0.15}px) translateZ(${-scaledDepth * 0.15}px) rotateX(-60deg) rotateY(180deg)`,
                    transformOrigin: 'bottom center',
                  }}
                />
              </>
            ) : (
              <div
                className="absolute bg-slate-600"
                style={{
                  width: `${scaledWidth}px`,
                  height: `${scaledDepth}px`,
                  transform: `translateY(${-scaledHeight / 2}px) rotateX(90deg)`,
                }}
              />
            )}
          </div>

          {/* Extension (if enabled) */}
          {showExtension && (
            <div
              className="absolute"
              style={{
                width: `${extDims.w}px`,
                height: `${extDims.h}px`,
                transform: `translateX(-50%) translateY(-50%) ${getExtensionTransform()}`,
                transformStyle: 'preserve-3d',
                opacity: 0.9,
              }}
            >
              {/* Extension front */}
              <div
                className="absolute bg-amber-100 border-2 border-dashed border-amber-500"
                style={{
                  width: `${extDims.w}px`,
                  height: `${extDims.h}px`,
                  transform: `translateZ(${extDims.d / 2}px)`,
                }}
              >
                {extensionType !== 'basement' && (
                  <div className="absolute top-2 left-1/2 -translate-x-1/2 w-8 h-6 bg-blue-100 border border-amber-500" />
                )}
              </div>
              
              {/* Extension back */}
              <div
                className="absolute bg-amber-200 border-2 border-dashed border-amber-500"
                style={{
                  width: `${extDims.w}px`,
                  height: `${extDims.h}px`,
                  transform: `translateZ(${-extDims.d / 2}px) rotateY(180deg)`,
                }}
              />
              
              {/* Extension left */}
              <div
                className="absolute bg-amber-150 border-2 border-dashed border-amber-500"
                style={{
                  width: `${extDims.d}px`,
                  height: `${extDims.h}px`,
                  transform: `translateX(${-extDims.d / 2}px) rotateY(-90deg)`,
                  backgroundColor: '#fef3c7',
                }}
              />
              
              {/* Extension right */}
              <div
                className="absolute bg-amber-100 border-2 border-dashed border-amber-500"
                style={{
                  width: `${extDims.d}px`,
                  height: `${extDims.h}px`,
                  transform: `translateX(${extDims.w - extDims.d / 2}px) rotateY(90deg)`,
                }}
              />
              
              {/* Extension roof */}
              <div
                className="absolute bg-amber-300 border-2 border-dashed border-amber-500"
                style={{
                  width: `${extDims.w}px`,
                  height: `${extDims.d}px`,
                  transform: `translateY(${-extDims.h / 2}px) rotateX(90deg)`,
                }}
              />

              {/* Label */}
              <div
                className="absolute text-xs font-bold text-amber-700 bg-amber-100/90 px-2 py-1 rounded whitespace-nowrap"
                style={{
                  transform: `translateZ(${extDims.d / 2 + 5}px) translateX(${extDims.w / 2 - 30}px) translateY(${-extDims.h / 2 + 10}px)`,
                }}
              >
                Proposed
              </div>
            </div>
          )}
        </div>

        {/* Instructions */}
        <div className="absolute bottom-4 left-4 text-xs text-slate-600 bg-white/80 px-2 py-1 rounded">
          Drag to rotate view
        </div>

        {/* Legend */}
        <div className="absolute top-4 right-4 bg-white/90 rounded-lg p-3 text-xs space-y-2">
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 bg-stone-300 border border-stone-400" />
            <span>Existing building</span>
          </div>
          {showExtension && (
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 bg-amber-100 border-2 border-dashed border-amber-500" />
              <span>Proposed extension</span>
            </div>
          )}
        </div>
      </div>

      {/* Dimension display */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 w-full">
        <div className="bg-stone-100 p-3 rounded-lg text-center">
          <div className="text-xs text-stone-600">Building Width</div>
          <div className="text-lg font-semibold">{width}m</div>
        </div>
        <div className="bg-stone-100 p-3 rounded-lg text-center">
          <div className="text-xs text-stone-600">Building Depth</div>
          <div className="text-lg font-semibold">{depth}m</div>
        </div>
        <div className="bg-stone-100 p-3 rounded-lg text-center">
          <div className="text-xs text-stone-600">Building Height</div>
          <div className="text-lg font-semibold">{height}m</div>
        </div>
        {showExtension && (
          <div className="bg-amber-100 p-3 rounded-lg text-center">
            <div className="text-xs text-amber-700">Extension</div>
            <div className="text-lg font-semibold text-amber-800">
              {extensionType === 'rear' && `${extensionDepth}m deep`}
              {extensionType === 'side' && `${extensionWidth}m wide`}
              {extensionType === 'loft' && `${extensionHeight}m high`}
              {extensionType === 'basement' && `${extensionHeight}m deep`}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

// ===========================================
// INTERACTIVE EXTENSION PLANNER
// ===========================================

interface ExtensionPlannerProps {
  onDimensionsChange?: (dims: {
    extensionType: string;
    width: number;
    depth: number;
    height: number;
  }) => void;
}

export function ExtensionPlanner3D({ onDimensionsChange }: ExtensionPlannerProps) {
  const [buildingWidth, setBuildingWidth] = useState(6);
  const [buildingDepth, setBuildingDepth] = useState(10);
  const [buildingHeight, setBuildingHeight] = useState(8);
  const [extensionType, setExtensionType] = useState<'rear' | 'side' | 'loft' | 'basement'>('rear');
  const [extensionDepth, setExtensionDepth] = useState(4);
  const [extensionWidth, setExtensionWidth] = useState(6);
  const [extensionHeight, setExtensionHeight] = useState(3);
  const [showExtension, setShowExtension] = useState(true);

  useEffect(() => {
    onDimensionsChange?.({
      extensionType,
      width: extensionWidth,
      depth: extensionDepth,
      height: extensionHeight,
    });
  }, [extensionType, extensionWidth, extensionDepth, extensionHeight, onDimensionsChange]);

  // Permitted development limits (simplified)
  const getPDLimits = () => {
    switch (extensionType) {
      case 'rear':
        return { maxDepth: 4, message: 'Single storey rear: max 4m (detached) or 3m (other)' };
      case 'side':
        return { maxWidth: 3, message: 'Single storey side: max half width of original house' };
      case 'loft':
        return { maxVolume: 50, message: 'Loft: max 50m³ additional roof space (terrace/semi)' };
      case 'basement':
        return { message: 'Basements require planning permission' };
    }
  };

  const pdLimits = getPDLimits();

  return (
    <div className="space-y-6">
      {/* 3D Viewer */}
      <Building3DViewer
        width={buildingWidth}
        depth={buildingDepth}
        height={buildingHeight}
        extensionType={extensionType}
        extensionDepth={extensionDepth}
        extensionWidth={extensionWidth}
        extensionHeight={extensionHeight}
        showExtension={showExtension}
      />

      {/* Controls */}
      <div className="bg-white rounded-xl border p-4 space-y-4">
        <h3 className="font-semibold text-lg">Extension Planner</h3>

        {/* Extension Type */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Extension Type</label>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
            {(['rear', 'side', 'loft', 'basement'] as const).map(type => (
              <button
                key={type}
                onClick={() => setExtensionType(type)}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                  extensionType === type
                    ? 'bg-blue-600 text-white'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                {type.charAt(0).toUpperCase() + type.slice(1)}
              </button>
            ))}
          </div>
        </div>

        {/* Toggle Extension */}
        <div className="flex items-center gap-2">
          <input
            type="checkbox"
            id="showExtension"
            checked={showExtension}
            onChange={(e) => setShowExtension(e.target.checked)}
            className="rounded"
          />
          <label htmlFor="showExtension" className="text-sm">Show proposed extension</label>
        </div>

        {/* Dimension Sliders */}
        <div className="grid md:grid-cols-2 gap-4">
          {/* Building dimensions */}
          <div className="space-y-3">
            <h4 className="font-medium text-gray-900">Existing Building</h4>
            
            <div>
              <label className="flex justify-between text-sm text-gray-600 mb-1">
                <span>Width</span>
                <span>{buildingWidth}m</span>
              </label>
              <input
                type="range"
                min="4"
                max="15"
                step="0.5"
                value={buildingWidth}
                onChange={(e) => setBuildingWidth(parseFloat(e.target.value))}
                className="w-full"
              />
            </div>

            <div>
              <label className="flex justify-between text-sm text-gray-600 mb-1">
                <span>Depth</span>
                <span>{buildingDepth}m</span>
              </label>
              <input
                type="range"
                min="6"
                max="20"
                step="0.5"
                value={buildingDepth}
                onChange={(e) => setBuildingDepth(parseFloat(e.target.value))}
                className="w-full"
              />
            </div>

            <div>
              <label className="flex justify-between text-sm text-gray-600 mb-1">
                <span>Height</span>
                <span>{buildingHeight}m</span>
              </label>
              <input
                type="range"
                min="5"
                max="12"
                step="0.5"
                value={buildingHeight}
                onChange={(e) => setBuildingHeight(parseFloat(e.target.value))}
                className="w-full"
              />
            </div>
          </div>

          {/* Extension dimensions */}
          <div className="space-y-3">
            <h4 className="font-medium text-amber-700">Proposed Extension</h4>

            {(extensionType === 'rear' || extensionType === 'basement') && (
              <div>
                <label className="flex justify-between text-sm text-gray-600 mb-1">
                  <span>Depth</span>
                  <span>{extensionDepth}m</span>
                </label>
                <input
                  type="range"
                  min="1"
                  max="8"
                  step="0.5"
                  value={extensionDepth}
                  onChange={(e) => setExtensionDepth(parseFloat(e.target.value))}
                  className="w-full accent-amber-500"
                />
              </div>
            )}

            {extensionType === 'side' && (
              <div>
                <label className="flex justify-between text-sm text-gray-600 mb-1">
                  <span>Width</span>
                  <span>{extensionWidth}m</span>
                </label>
                <input
                  type="range"
                  min="1"
                  max="6"
                  step="0.5"
                  value={extensionWidth}
                  onChange={(e) => setExtensionWidth(parseFloat(e.target.value))}
                  className="w-full accent-amber-500"
                />
              </div>
            )}

            <div>
              <label className="flex justify-between text-sm text-gray-600 mb-1">
                <span>Height</span>
                <span>{extensionHeight}m</span>
              </label>
              <input
                type="range"
                min="2"
                max="6"
                step="0.5"
                value={extensionHeight}
                onChange={(e) => setExtensionHeight(parseFloat(e.target.value))}
                className="w-full accent-amber-500"
              />
            </div>
          </div>
        </div>

        {/* PD Info */}
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
          <div className="flex items-start gap-2">
            <svg className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <div className="text-sm text-blue-800">
              <span className="font-medium">Permitted Development Guide:</span>
              <p className="text-blue-700 mt-1">{pdLimits.message}</p>
            </div>
          </div>
        </div>

        {/* Area calculation */}
        <div className="bg-gray-50 rounded-lg p-3">
          <div className="grid grid-cols-2 gap-4 text-sm">
            <div>
              <span className="text-gray-600">Existing floor area:</span>
              <span className="font-semibold ml-2">{(buildingWidth * buildingDepth).toFixed(1)}m²</span>
            </div>
            <div>
              <span className="text-gray-600">Extension area:</span>
              <span className="font-semibold text-amber-700 ml-2">
                {extensionType === 'side'
                  ? (extensionWidth * buildingDepth).toFixed(1)
                  : extensionType === 'loft'
                  ? (buildingWidth * buildingDepth * 0.7).toFixed(1) // Approximate loft area
                  : (extensionWidth * extensionDepth).toFixed(1)
                }m²
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Building3DViewer;
