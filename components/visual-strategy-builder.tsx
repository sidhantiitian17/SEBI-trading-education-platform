/**
 * Visual Strategy Builder Component
 * Drag-and-drop interface for creating algorithmic trading strategies
 */

'use client';

import React, { useState, useCallback, useRef, useEffect } from 'react';
import { DragDropContext, Droppable, Draggable, DropResult } from 'react-beautiful-dnd';
import {
  StrategyTemplate,
  VisualStrategyBuilder,
  CanvasElement,
  ComponentLibrary,
  Connection,
  TechnicalIndicator,
  Condition,
  Action,
  DragDropInterface,
  RealTimePreview,
  TradingSignal,
  RealTimePerformance
} from '../lib/algo-trading-types';
import { algoTradingEducationModule } from '../lib/algo-trading-education';

interface VisualStrategyBuilderProps {
  initialStrategy?: StrategyTemplate;
  onStrategyChange?: (strategy: StrategyTemplate) => void;
  onSave?: (strategy: StrategyTemplate) => void;
  className?: string;
}

export const VisualStrategyBuilderComponent: React.FC<VisualStrategyBuilderProps> = ({
  initialStrategy,
  onStrategyChange,
  onSave,
  className = ''
}) => {
  const [builder, setBuilder] = useState<VisualStrategyBuilder>(() =>
    algoTradingEducationModule.createVisualStrategyBuilder()
  );
  const [selectedElement, setSelectedElement] = useState<CanvasElement | null>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [connections, setConnections] = useState<Connection[]>([]);
  const canvasRef = useRef<HTMLDivElement>(null);

  // Initialize with existing strategy if provided
  useEffect(() => {
    if (initialStrategy) {
      // Convert strategy to canvas elements
      const elements: CanvasElement[] = [];

      // Add indicators
      initialStrategy.indicators.forEach((indicator, index) => {
        elements.push({
          id: `indicator-${index}`,
          type: 'indicator',
          position: { x: 100 + index * 200, y: 100 },
          size: { width: 120, height: 60 },
          properties: indicator
        });
      });

      // Add conditions
      elements.push({
        id: 'condition-1',
        type: 'condition',
        position: { x: 300, y: 200 },
        size: { width: 120, height: 60 },
        properties: {
          name: 'Cross Above',
          type: 'comparison',
          parameters: [],
          description: 'When fast MA crosses above slow MA'
        }
      });

      // Add actions
      elements.push({
        id: 'action-1',
        type: 'action',
        position: { x: 500, y: 200 },
        size: { width: 120, height: 60 },
        properties: {
          name: 'Buy',
          type: 'buy',
          parameters: [],
          description: 'Enter long position'
        }
      });

      setBuilder(prev => ({
        ...prev,
        canvas: {
          ...prev.canvas,
          elements
        }
      }));
    }
  }, [initialStrategy]);

  // Handle drag and drop
  const handleDragEnd = useCallback((result: DropResult) => {
    setIsDragging(false);

    if (!result.destination) return;

    const { source, destination, draggableId } = result;

    // If dropping from component library to canvas
    if (source.droppableId === 'component-library' && destination.droppableId === 'canvas') {
      const componentType = draggableId.split('-')[0];
      const componentName = draggableId.split('-').slice(1).join('-');

      // Find the component in the library
      let component: any = null;
      switch (componentType) {
        case 'indicator':
          component = builder.componentLibrary.indicators.find(i => i.name === componentName);
          break;
        case 'condition':
          component = builder.componentLibrary.conditions.find(c => c.name === componentName);
          break;
        case 'action':
          component = builder.componentLibrary.actions.find(a => a.name === componentName);
          break;
      }

      if (component) {
        const newElement: CanvasElement = {
          id: `${componentType}-${Date.now()}`,
          type: componentType as 'indicator' | 'condition' | 'action',
          position: {
            x: destination.index * 150 + 50,
            y: Math.floor(destination.index / 5) * 150 + 50
          },
          size: { width: 120, height: 60 },
          properties: component
        };

        setBuilder(prev => ({
          ...prev,
          canvas: {
            ...prev.canvas,
            elements: [...prev.canvas.elements, newElement]
          }
        }));
      }
    }

    // If moving element within canvas
    else if (source.droppableId === 'canvas' && destination.droppableId === 'canvas') {
      const elements = Array.from(builder.canvas.elements);
      const [reorderedElement] = elements.splice(source.index, 1);
      elements.splice(destination.index, 0, reorderedElement);

      setBuilder(prev => ({
        ...prev,
        canvas: {
          ...prev.canvas,
          elements
        }
      }));
    }
  }, [builder]);

  // Handle element selection
  const handleElementClick = useCallback((element: CanvasElement) => {
    setSelectedElement(element);
  }, []);

  // Handle canvas click (deselect)
  const handleCanvasClick = useCallback((e: React.MouseEvent) => {
    if (e.target === e.currentTarget) {
      setSelectedElement(null);
    }
  }, []);

  // Handle element position change
  const handleElementMove = useCallback((elementId: string, newPosition: { x: number; y: number }) => {
    setBuilder(prev => ({
      ...prev,
      canvas: {
        ...prev.canvas,
        elements: prev.canvas.elements.map(el =>
          el.id === elementId ? { ...el, position: newPosition } : el
        )
      }
    }));
  }, []);

  // Handle connection creation
  const handleConnectionCreate = useCallback((fromId: string, toId: string) => {
    const newConnection: Connection = {
      id: `connection-${Date.now()}`,
      from: fromId,
      to: toId,
      type: 'signal'
    };

    setConnections(prev => [...prev, newConnection]);

    // Update canvas connections
    setBuilder(prev => ({
      ...prev,
      canvas: {
        ...prev.canvas,
        connections: [...prev.canvas.connections, newConnection]
      }
    }));
  }, []);

  // Generate strategy from canvas
  const generateStrategy = useCallback(async () => {
    if (!initialStrategy) return null;

    try {
      const strategy = await algoTradingEducationModule.createStrategyFromCanvas(
        builder.canvas,
        initialStrategy.name,
        initialStrategy.description
      );

      onStrategyChange?.(strategy);
      return strategy;
    } catch (error) {
      console.error('Failed to generate strategy:', error);
      return null;
    }
  }, [builder.canvas, initialStrategy, onStrategyChange]);

  // Save strategy
  const handleSave = useCallback(async () => {
    if (!initialStrategy) return;

    const strategy = await generateStrategy();
    if (strategy) {
      onSave?.(strategy);
    }
  }, [generateStrategy, onSave, initialStrategy]);

  return (
    <div className={`visual-strategy-builder ${className}`}>
      <div className="builder-header">
        <h2 className="text-2xl font-bold mb-4">Visual Strategy Builder</h2>
        <div className="flex gap-4">
          <button
            onClick={generateStrategy}
            className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
          >
            Generate Strategy
          </button>
          <button
            onClick={handleSave}
            className="px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600"
          >
            Save Strategy
          </button>
        </div>
      </div>

      <DragDropContext onDragEnd={handleDragEnd} onDragStart={() => setIsDragging(true)}>
        <div className="builder-content flex gap-6">
          {/* Component Library */}
          <div className="component-library w-80">
            <h3 className="text-lg font-semibold mb-4">Component Library</h3>

            {/* Indicators */}
            <div className="mb-6">
              <h4 className="font-medium mb-2">Technical Indicators</h4>
              <Droppable droppableId="component-library-indicators" isDropDisabled={true}>
                {(provided: any) => (
                  <div
                    ref={provided.innerRef}
                    {...provided.droppableProps}
                    className="space-y-2"
                  >
                    {builder.componentLibrary.indicators.map((indicator, index) => (
                      <Draggable
                        key={`indicator-${indicator.name}`}
                        draggableId={`indicator-${indicator.name}`}
                        index={index}
                      >
                        {(provided: any, snapshot: any) => (
                          <div
                            ref={provided.innerRef}
                            {...provided.draggableProps}
                            {...provided.dragHandleProps}
                            className={`p-3 bg-blue-50 border border-blue-200 rounded cursor-move hover:bg-blue-100 ${
                              snapshot.isDragging ? 'shadow-lg' : ''
                            }`}
                          >
                            <div className="font-medium">{indicator.name}</div>
                            <div className="text-sm text-gray-600">{indicator.type}</div>
                          </div>
                        )}
                      </Draggable>
                    ))}
                    {provided.placeholder}
                  </div>
                )}
              </Droppable>
            </div>

            {/* Conditions */}
            <div className="mb-6">
              <h4 className="font-medium mb-2">Conditions</h4>
              <Droppable droppableId="component-library-conditions" isDropDisabled={true}>
                {(provided: any) => (
                  <div
                    ref={provided.innerRef}
                    {...provided.droppableProps}
                    className="space-y-2"
                  >
                    {builder.componentLibrary.conditions.map((condition, index) => (
                      <Draggable
                        key={`condition-${condition.name}`}
                        draggableId={`condition-${condition.name}`}
                        index={index}
                      >
                        {(provided: any, snapshot: any) => (
                          <div
                            ref={provided.innerRef}
                            {...provided.draggableProps}
                            {...provided.dragHandleProps}
                            className={`p-3 bg-green-50 border border-green-200 rounded cursor-move hover:bg-green-100 ${
                              snapshot.isDragging ? 'shadow-lg' : ''
                            }`}
                          >
                            <div className="font-medium">{condition.name}</div>
                            <div className="text-sm text-gray-600">{condition.description}</div>
                          </div>
                        )}
                      </Draggable>
                    ))}
                    {provided.placeholder}
                  </div>
                )}
              </Droppable>
            </div>

            {/* Actions */}
            <div>
              <h4 className="font-medium mb-2">Actions</h4>
              <Droppable droppableId="component-library-actions" isDropDisabled={true}>
                {(provided: any) => (
                  <div
                    ref={provided.innerRef}
                    {...provided.droppableProps}
                    className="space-y-2"
                  >
                    {builder.componentLibrary.actions.map((action, index) => (
                      <Draggable
                        key={`action-${action.name}`}
                        draggableId={`action-${action.name}`}
                        index={index}
                      >
                        {(provided: any, snapshot: any) => (
                          <div
                            ref={provided.innerRef}
                            {...provided.draggableProps}
                            {...provided.dragHandleProps}
                            className={`p-3 bg-red-50 border border-red-200 rounded cursor-move hover:bg-red-100 ${
                              snapshot.isDragging ? 'shadow-lg' : ''
                            }`}
                          >
                            <div className="font-medium">{action.name}</div>
                            <div className="text-sm text-gray-600">{action.description}</div>
                          </div>
                        )}
                      </Draggable>
                    ))}
                    {provided.placeholder}
                  </div>
                )}
              </Droppable>
            </div>
          </div>

          {/* Canvas */}
          <div className="canvas flex-1">
            <div className="canvas-header flex justify-between items-center mb-4">
              <h3 className="text-lg font-semibold">Strategy Canvas</h3>
              <div className="flex gap-2">
                <button className="px-3 py-1 text-sm bg-gray-100 rounded hover:bg-gray-200">
                  Zoom In
                </button>
                <button className="px-3 py-1 text-sm bg-gray-100 rounded hover:bg-gray-200">
                  Zoom Out
                </button>
                <button className="px-3 py-1 text-sm bg-gray-100 rounded hover:bg-gray-200">
                  Fit to Screen
                </button>
              </div>
            </div>

            <Droppable droppableId="canvas">
              {(provided: any, snapshot: any) => (
                <div
                  ref={provided.innerRef}
                  {...provided.droppableProps}
                  className={`canvas-area relative bg-gray-50 border-2 border-dashed border-gray-300 rounded-lg min-h-96 overflow-auto ${
                    snapshot.isDraggingOver ? 'border-blue-400 bg-blue-50' : ''
                  }`}
                  onClick={handleCanvasClick}
                  style={{
                    backgroundImage: builder.canvas.grid
                      ? 'radial-gradient(circle, #e5e7eb 1px, transparent 1px)'
                      : 'none',
                    backgroundSize: '20px 20px'
                  }}
                >
                  {builder.canvas.elements.map((element, index) => (
                    <Draggable
                      key={element.id}
                      draggableId={element.id}
                      index={index}
                    >
                      {(provided: any, snapshot: any) => (
                        <div
                          ref={provided.innerRef}
                          {...provided.draggableProps}
                          {...provided.dragHandleProps}
                          className={`canvas-element absolute p-3 rounded-lg border-2 cursor-move transition-all ${
                            element.type === 'indicator'
                              ? 'bg-blue-100 border-blue-300'
                              : element.type === 'condition'
                              ? 'bg-green-100 border-green-300'
                              : 'bg-red-100 border-red-300'
                          } ${
                            selectedElement?.id === element.id
                              ? 'ring-2 ring-blue-500 shadow-lg'
                              : ''
                          } ${
                            snapshot.isDragging ? 'shadow-2xl rotate-3' : ''
                          }`}
                          style={{
                            left: element.position.x,
                            top: element.position.y,
                            ...provided.draggableProps.style
                          }}
                          onClick={(e) => {
                            e.stopPropagation();
                            handleElementClick(element);
                          }}
                        >
                          <div className="font-medium text-sm">{element.properties.name}</div>
                          <div className="text-xs text-gray-600 mt-1">
                            {element.type.charAt(0).toUpperCase() + element.type.slice(1)}
                          </div>

                          {/* Connection points */}
                          <div className="absolute -left-2 top-1/2 w-4 h-4 bg-white border-2 border-gray-400 rounded-full transform -translate-y-1/2 cursor-crosshair"
                               onClick={(e) => {
                                 e.stopPropagation();
                                 // Handle connection start
                               }}>
                          </div>
                          <div className="absolute -right-2 top-1/2 w-4 h-4 bg-white border-2 border-gray-400 rounded-full transform -translate-y-1/2 cursor-crosshair"
                               onClick={(e) => {
                                 e.stopPropagation();
                                 // Handle connection end
                               }}>
                          </div>
                        </div>
                      )}
                    </Draggable>
                  ))}

                  {/* Render connections */}
                  <svg className="absolute inset-0 pointer-events-none">
                    {connections.map((connection) => {
                      const fromElement = builder.canvas.elements.find(el => el.id === connection.from);
                      const toElement = builder.canvas.elements.find(el => el.id === connection.to);

                      if (!fromElement || !toElement) return null;

                      const fromX = fromElement.position.x + 120; // Approximate width
                      const fromY = fromElement.position.y + 30;  // Approximate height/2
                      const toX = toElement.position.x;
                      const toY = toElement.position.y + 30;

                      return (
                        <line
                          key={connection.id}
                          x1={fromX}
                          y1={fromY}
                          x2={toX}
                          y2={toY}
                          stroke="#3b82f6"
                          strokeWidth="2"
                          markerEnd="url(#arrowhead)"
                        />
                      );
                    })}
                    <defs>
                      <marker
                        id="arrowhead"
                        markerWidth="10"
                        markerHeight="7"
                        refX="9"
                        refY="3.5"
                        orient="auto"
                      >
                        <polygon
                          points="0 0, 10 3.5, 0 7"
                          fill="#3b82f6"
                        />
                      </marker>
                    </defs>
                  </svg>

                  {provided.placeholder}
                </div>
              )}
            </Droppable>
          </div>

          {/* Properties Panel */}
          <div className="properties-panel w-80">
            <h3 className="text-lg font-semibold mb-4">Properties</h3>

            {selectedElement ? (
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium mb-1">Element Type</label>
                  <div className="text-sm text-gray-600 capitalize">{selectedElement.type}</div>
                </div>

                <div>
                  <label className="block text-sm font-medium mb-1">Name</label>
                  <input
                    type="text"
                    value={selectedElement.properties.name || ''}
                    onChange={(e) => {
                      setBuilder(prev => ({
                        ...prev,
                        canvas: {
                          ...prev.canvas,
                          elements: prev.canvas.elements.map(el =>
                            el.id === selectedElement.id
                              ? { ...el, properties: { ...el.properties, name: e.target.value } }
                              : el
                          )
                        }
                      }));
                    }}
                    className="w-full p-2 border border-gray-300 rounded"
                  />
                </div>

                {/* Element-specific properties */}
                {selectedElement.type === 'indicator' && (
                  <div className="space-y-3">
                    <div>
                      <label className="block text-sm font-medium mb-1">Period</label>
                      <input
                        type="number"
                        value={selectedElement.properties.parameters?.period || ''}
                        onChange={(e) => {
                          setBuilder(prev => ({
                            ...prev,
                            canvas: {
                              ...prev.canvas,
                              elements: prev.canvas.elements.map(el =>
                                el.id === selectedElement.id
                                  ? {
                                      ...el,
                                      properties: {
                                        ...el.properties,
                                        parameters: {
                                          ...el.properties.parameters,
                                          period: parseInt(e.target.value)
                                        }
                                      }
                                    }
                                  : el
                              )
                            }
                          }));
                        }}
                        className="w-full p-2 border border-gray-300 rounded"
                      />
                    </div>
                  </div>
                )}

                {selectedElement.type === 'condition' && (
                  <div className="space-y-3">
                    <div>
                      <label className="block text-sm font-medium mb-1">Threshold</label>
                      <input
                        type="number"
                        step="0.01"
                        value={selectedElement.properties.parameters?.threshold || ''}
                        onChange={(e) => {
                          setBuilder(prev => ({
                            ...prev,
                            canvas: {
                              ...prev.canvas,
                              elements: prev.canvas.elements.map(el =>
                                el.id === selectedElement.id
                                  ? {
                                      ...el,
                                      properties: {
                                        ...el.properties,
                                        parameters: {
                                          ...el.properties.parameters,
                                          threshold: parseFloat(e.target.value)
                                        }
                                      }
                                    }
                                  : el
                              )
                            }
                          }));
                        }}
                        className="w-full p-2 border border-gray-300 rounded"
                      />
                    </div>
                  </div>
                )}
              </div>
            ) : (
              <div className="text-gray-500 text-center py-8">
                Select an element to view its properties
              </div>
            )}
          </div>
        </div>
      </DragDropContext>

      {/* Real-time Preview */}
      <div className="preview-section mt-8">
        <h3 className="text-lg font-semibold mb-4">Real-time Preview</h3>
        <div className="bg-gray-50 p-4 rounded-lg">
          <div className="grid grid-cols-4 gap-4">
            <div className="text-center">
              <div className="text-2xl font-bold text-green-600">
                {builder.realTimePreview.performance.totalReturn.toFixed(2)}%
              </div>
              <div className="text-sm text-gray-600">Total Return</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-blue-600">
                {builder.realTimePreview.performance.winRate.toFixed(1)}%
              </div>
              <div className="text-sm text-gray-600">Win Rate</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-purple-600">
                {builder.realTimePreview.performance.profitFactor.toFixed(2)}
              </div>
              <div className="text-sm text-gray-600">Profit Factor</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-red-600">
                {builder.realTimePreview.performance.maxDrawdown.toFixed(2)}%
              </div>
              <div className="text-sm text-gray-600">Max Drawdown</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default VisualStrategyBuilderComponent;
