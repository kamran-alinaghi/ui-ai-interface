export type MOSAComponentGraph = {
    system_name: string;                                // name of the product that AI software developer is developing
    description: string;                                // any required desvription
    components: ComponentNode[];                        // all components that will make this product work
    connections: ComponentConnection[];                 // how the components are connected and how the communicate
};

export type ComponentNode = {
    id: string;
    name: string;
    description: string;
    inputs: string[];                                   // refers to inputs that this component need to work
    outputs: string[];                                  // what will be the output of this component
    pipelines: ComponentPipeline[];                     // multiple allowed
};

export type ComponentConnection = {
    to: string;                                         // id of target component
    direction: 'send' | 'receive' | 'bidirectional';    // shows how components interact
    data: string[];                                     // type of data or events passed between them
};

export type ComponentPipeline = {
    pipeline_name: string;
    description?: string;
    input_fields: string[];
    output_field: string;
    steps: FunctionStep[];
};

export type FunctionContract = {
    function_name: string;
    description: string;
    inputs: InputField[];                               // all arguments. their name and their type
    outputs: OutputField[];
    pipeline_steps?: FunctionContract[];
    constraints?: string[];
    side_effects?: string[];
    error_handling?: ErrorPath[];
    test_cases: TestCase[];
    resources_used?: string[];                          // any imports this function may need
    execution_phase: string;                            // Defines order and parallelism ("1", "2.1", etc.)
};


export type InputField = {
    type: string;                                       // e.g., "string", "number", "UserObject"
    constraints?: string;                               // e.g., "must be a positive integer"
    name?: string;                                      // Optional — AI assigns if not provided
};

export type OutputField = {
    type: string;                                       // e.g., "boolean", "UserData"
    name?: string;                                      // Optional — used if referenced in test cases
};

export type ErrorPath = {
    condition: string;                                  // e.g., "token is expired"
    action: string;                                     // e.g., "throw 'UnauthorizedError'"
};

export type TestCase = {
    name: string;                                       // e.g., "Valid login"
    input: Record<string, any>;                         // Key-value map of inputs
    expected_output: Record<string, any>;               // Expected results
    expect_error?: string;                              // If an error should occur
};

export type FunctionStep = {
    function_name: string;                              // name of the function (FunctionContract.function_name)
    input_fields: string[];                             // variables used in this context
    output_field: string;                               // variable this step produces
    execution_phase: string;                            // optional but powerful for AI
};

export interface ArchitectureJSON{
    architecture: MOSAComponentGraph;
    functions: FunctionContract[];
}